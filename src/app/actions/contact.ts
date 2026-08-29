"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import {
  asErrorCode,
  type ContactErrorCode,
  type ContactField,
  type ContactState,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  RENDERED_AT_FIELD,
} from "@/lib/contact-contract";
import { sendContactEmail } from "@/lib/contact-email";
import { getContactEnv } from "@/lib/contact-env";
import { getRatelimit } from "@/lib/ratelimit";
import { contactSchema } from "@/lib/schemas";
import { insertSubmission } from "@/lib/supabase";

// A "use server" module may only export async functions, so the constants and
// the state type this action shares with the form live in contact-contract.ts.

/**
 * Hashes the caller's IP so the rate-limit key and the stored row identify a
 * repeat sender without holding a raw address. Keyed HMAC rather than a bare
 * hash: the IPv4 space is small enough to brute-force a plain SHA-256 in
 * seconds, and the service-role key is a secret that is necessarily present
 * whenever this code runs, so it needs no eighth environment variable.
 */
function hashIp(ip: string, key: string): string {
  return createHmac("sha256", key).update(ip).digest("hex");
}

async function callerIp(): Promise<string> {
  const h = await headers();
  // Vercel sets both; x-forwarded-for is a chain, and the client is first.
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

function fail(
  values: ContactState["values"],
  formError?: ContactErrorCode,
  fieldErrors?: ContactState["fieldErrors"],
): ContactState {
  return { status: "error", values, formError, fieldErrors };
}

/**
 * validate -> honeypot -> timing -> rate limit -> insert -> send.
 *
 * The honeypot runs before the rate limiter rather than after it, as PLAN.md
 * sketched. A honeypot hit already returns a fake success, so rate limiting it
 * changes nothing for the bot and costs a Redis command per hit out of a free
 * tier. Everything with an external quota — Upstash, Supabase, Resend — sits
 * behind every check that is free.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    locale: String(formData.get("locale") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, message: raw.message };

  // 1. Honeypot. A human never sees this field, so anything in it is a bot.
  // Report success: telling a bot it was caught only teaches it to try again.
  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") {
    return { status: "success" };
  }

  // 2. Validate.
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, ContactErrorCode>> = {};
    let formError: ContactErrorCode | undefined;
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      const code = asErrorCode(issue.message);
      if (field === "name" || field === "email" || field === "message") {
        fieldErrors[field] ??= code;
      } else {
        formError ??= code;
      }
    }
    return fail(values, formError, fieldErrors);
  }

  // 3. Timing. Absent or unparseable means the client never stamped it — no
  // JavaScript — so the check is skipped rather than failed. A no-JS visitor is
  // a person, and this form must work for them.
  const stamped = Number(formData.get(RENDERED_AT_FIELD));
  if (Number.isFinite(stamped) && stamped > 0 && Date.now() - stamped < MIN_FILL_MS) {
    return fail(values, "too_fast");
  }

  const env = getContactEnv();
  // Unreachable in practice: the section does not render the form without a
  // full configuration. It stays because a server action is a public endpoint —
  // it can be POSTed to directly, whatever the page chose to render.
  if (!env) return fail(values, "unavailable");

  const ipHash = hashIp(await callerIp(), env.supabaseServiceRoleKey);

  // 4. Rate limit: 3/hour per hashed IP.
  try {
    const { success } = await getRatelimit(env).limit(ipHash);
    if (!success) return fail(values, "rate_limited");
  } catch (error) {
    // Upstash being down must not become an open relay.
    console.error("[contact] rate limit check failed", error);
    return fail(values, "failed");
  }

  // 5. Store, then 6. send. Insert first so a Resend outage never loses an
  // enquiry — the row can be answered by hand.
  let id: string;
  try {
    id = await insertSubmission(env, { ...parsed.data, ip_hash: ipHash });
  } catch (error) {
    console.error("[contact] insert failed", error);
    return fail(values, "failed");
  }

  try {
    await sendContactEmail(env, parsed.data, id);
  } catch (error) {
    // The message is safely stored, so this is a success from the sender's
    // side. Logged loudly because the inbox is now out of sync with the table.
    console.error(`[contact] stored ${id} but email failed`, error);
  }

  return { status: "success" };
}
