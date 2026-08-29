import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ContactEnv } from "./contact-env";

/**
 * The service-role client. It bypasses RLS, so it must never be constructed in
 * anything that could be bundled for the browser — hence `server-only` above
 * and the fact that nothing exports the key itself.
 *
 * `contact_submissions` has RLS on with no policies at all, which means the
 * anon key can neither read nor write it. This client is the only way in.
 * See supabase/migrations/0001_contact_submissions.sql.
 */

let client: SupabaseClient | null = null;

export function getSupabase(env: ContactEnv): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        // There is no user here — this is a machine writing one row. Persisting
        // or refreshing a session would be pointless work on every cold start.
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return client;
}

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  locale: string;
  ip_hash: string;
};

/**
 * Inserts one submission. Returns the new row's id.
 *
 * This runs *before* the email is sent, on purpose: Resend is the part most
 * likely to fail, and a lost enquiry on a job-search site is the worst outcome
 * in the system. A stored row can always be re-sent by hand.
 */
export async function insertSubmission(
  env: ContactEnv,
  submission: ContactSubmission,
): Promise<string> {
  const { data, error } = await getSupabase(env)
    .from("contact_submissions")
    .insert(submission)
    .select("id")
    .single();

  if (error) throw new Error(`supabase insert failed: ${error.message}`);
  return data.id as string;
}
