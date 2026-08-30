import "server-only";

/**
 * Server-side configuration for the contact system.
 *
 * Blank counts as absent. Stage 0 lost a production build to
 * `process.env.X ?? fallback` treating an empty Vercel variable as set, and the
 * same mistake here would be worse: a form that renders, accepts a message and
 * then throws on a blank API key. Everything is read through `req()`.
 *
 * All seven are required together. Rate limiting is not optional — a contact
 * form without it is a spam relay — so a half-configured environment yields no
 * form at all rather than an unprotected one.
 *
 * None of these carries a NEXT_PUBLIC_ prefix. The browser never talks to
 * Supabase or Upstash here — every call goes through the server action — so a
 * public prefix would buy nothing and, on the service-role key, would inline a
 * credential that bypasses row-level security into the client bundle.
 */

export type ContactEnv = {
  resendApiKey: string;
  toEmail: string;
  fromEmail: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  upstashUrl: string;
  upstashToken: string;
};

/**
 * Reads one variable, or null if it is absent or blank.
 *
 * Surrounding quotes are stripped. Several dashboards — Upstash's in
 * particular — present their credentials as a ready-made `.env` snippet with
 * the value already quoted, and pasting that into a platform UI stores the
 * quotes as part of the value. `dotenv` strips them when the same text sits in
 * a real `.env` file, so without this the app works locally and fails in
 * production with a value that looks correct in every dashboard: the error is
 * `invalid URL. Received: ""https://…""`. Matching dotenv's behaviour makes a
 * variable mean the same thing wherever it was set.
 */
function req(name: string): string | null {
  const raw = process.env[name]?.trim();
  if (!raw) return null;
  const unquoted =
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
      ? raw.slice(1, -1).trim()
      : raw;
  return unquoted === "" ? null : unquoted;
}

let cached: ContactEnv | null | undefined;

/**
 * The whole configuration, or `null` if any part of it is missing.
 *
 * Callers must treat `null` as "do not render the form". The alternative —
 * showing a form that cannot deliver — is the failure mode the CONTACT section
 * has been guarding against since stage 5.
 */
export function getContactEnv(): ContactEnv | null {
  if (cached !== undefined) return cached;

  const resendApiKey = req("RESEND_API_KEY");
  const toEmail = req("CONTACT_TO_EMAIL");
  const fromEmail = req("CONTACT_FROM_EMAIL");
  const supabaseUrl = req("SUPABASE_URL");
  const supabaseServiceRoleKey = req("SUPABASE_SERVICE_ROLE_KEY");
  const upstashUrl = req("UPSTASH_REDIS_REST_URL");
  const upstashToken = req("UPSTASH_REDIS_REST_TOKEN");

  cached =
    resendApiKey &&
    toEmail &&
    fromEmail &&
    supabaseUrl &&
    supabaseServiceRoleKey &&
    upstashUrl &&
    upstashToken
      ? {
          resendApiKey,
          toEmail,
          fromEmail,
          supabaseUrl,
          supabaseServiceRoleKey,
          upstashUrl,
          upstashToken,
        }
      : null;

  return cached;
}

/** Whether the CONTACT section should render the form at all. */
export function isContactConfigured(): boolean {
  return getContactEnv() !== null;
}
