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

function req(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : null;
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
  const supabaseUrl = req("NEXT_PUBLIC_SUPABASE_URL");
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
