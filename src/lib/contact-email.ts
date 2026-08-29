import "server-only";
import { Resend } from "resend";
import type { ContactEnv } from "./contact-env";
import type { ContactInput } from "./schemas";

/**
 * The notification that lands in Aayush's inbox.
 *
 * Hand-authored HTML with a plain-text sibling, rather than React Email as
 * PLAN.md §1 suggested. The plan's reason for React Email was "a decent-looking
 * notification instead of a plaintext blob" — that is met here without the
 * dependency, because the site's own idiom is monospace text on hairlines and
 * translates to a table-free email almost literally. See docs/DECISIONS.md.
 */

let resend: Resend | null = null;

function getResend(env: ContactEnv): Resend {
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

/** Email clients render whatever you give them — escape before interpolating. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const INK = "#1f2937";
const PROSE = "#4b5563";
const ACCENT = "#dc2626";
const RULE = "#e5e7eb";

function row(label: string, value: string): string {
  return `<tr>
  <td style="padding:14px 0;border-bottom:1px solid ${RULE};font:11px ${MONO};letter-spacing:.2em;color:${ACCENT};vertical-align:top;width:120px">${esc(label)}</td>
  <td style="padding:14px 0;border-bottom:1px solid ${RULE};font:14px ${MONO};color:${INK};vertical-align:top">${esc(value)}</td>
</tr>`;
}

export function renderContactEmail(input: ContactInput, id: string) {
  const subject = `[PORTFOLIO] ${input.name} — ${input.locale.toUpperCase()}`;

  const text = [
    "NEW CONTACT SUBMISSION",
    "",
    `NAME     ${input.name}`,
    `EMAIL    ${input.email}`,
    `LOCALE   ${input.locale}`,
    `REF      ${id}`,
    "",
    "MESSAGE",
    "",
    input.message,
    "",
    "--",
    "Sent from the contact form. Reply directly to answer the sender.",
  ].join("\n");

  const html = `<div style="background:#ffffff;padding:32px;font:14px ${MONO};color:${INK}">
<div style="max-width:640px;margin:0 auto">
  <p style="margin:0 0 24px;font:11px ${MONO};letter-spacing:.2em;color:${ACCENT}">[ NEW CONTACT SUBMISSION ]</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
    ${row("NAME", input.name)}
    ${row("EMAIL", input.email)}
    ${row("LOCALE", input.locale)}
    ${row("REF", id)}
  </table>
  <p style="margin:28px 0 8px;font:11px ${MONO};letter-spacing:.2em;color:${ACCENT}">MESSAGE</p>
  <div style="white-space:pre-wrap;font:14px/1.7 ${MONO};color:${INK}">${esc(input.message)}</div>
  <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid ${RULE};font:11px ${MONO};color:${PROSE}">Reply directly to answer the sender.</p>
</div>
</div>`;

  return { subject, text, html };
}

/**
 * Sends the notification. `replyTo` is the point of the whole thing: hitting
 * reply in the inbox answers the person who wrote in, not the Resend sender.
 */
export async function sendContactEmail(
  env: ContactEnv,
  input: ContactInput,
  id: string,
): Promise<void> {
  const { subject, text, html } = renderContactEmail(input, id);

  const { error } = await getResend(env).emails.send({
    from: env.fromEmail,
    to: env.toEmail,
    replyTo: input.email,
    subject,
    text,
    html,
  });

  if (error) throw new Error(`resend send failed: ${error.message}`);
}
