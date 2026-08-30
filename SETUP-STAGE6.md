# Stage 6 — the three accounts the contact form needs

The code is finished and tested. It will not render a form until all seven
environment variables below are set — that is deliberate, not a bug. A form
that renders and then drops the message is worse than no form, so
`isContactConfigured()` gates the whole thing and the page falls back to the
mailto link and the "available on request" note.

Budget: about twenty minutes, all on free tiers, no card required.

---

## 1. Supabase — where every submission is stored (8 min)

1. supabase.com → **New project**. Any name; pick the Tokyo region.
2. Wait for it to provision, then **SQL Editor → New query**.
3. Paste the whole of `supabase/migrations/0001_contact_submissions.sql` and
   **Run**. It is idempotent, so re-running it is safe.
4. **Project Settings → API**, and copy two values:
   - Project URL (the **Connect** dialog, or Settings → Data API) → `SUPABASE_URL`
   - **Settings → API Keys → Secret keys → Create new secret key** →
     `SUPABASE_SERVICE_ROLE_KEY`. New Supabase projects no longer offer a
     `service_role` key; the `sb_secret_…` key replaces it and behaves the same
     way, bypassing row-level security. Copy it at once — it is shown only once.

> The `service_role` key bypasses row-level security. It is a real secret.
> Never prefix it `NEXT_PUBLIC_`, never paste it into a client component, and
> never commit it. `src/lib/supabase.ts` imports `server-only`, so if it ever
> ends up in something the client imports, the build fails rather than leaking.

The table has RLS **on with no policies at all**. That is the security model:
the anon key can neither read nor write it, so a leaked anon key buys nothing.
Do not add an insert policy.

## 2. Resend — the notification email (6 min)

1. resend.com → sign up → **API Keys → Create API Key**, sending permission
   only → `RESEND_API_KEY`.
2. `CONTACT_TO_EMAIL` = the address you want enquiries at.
3. `CONTACT_FROM_EMAIL` = leave it as `onboarding@resend.dev` until you own a
   domain. That address only delivers to the address you signed up with, which
   is fine for now.
4. When the custom domain lands in stage 9: **Domains → Add Domain**, add the
   SPF and DKIM records it gives you, then change `CONTACT_FROM_EMAIL` to
   something on that domain. Until SPF/DKIM verify, mail from your own domain
   will land in spam.

## 3. Upstash — rate limiting (4 min)

1. upstash.com → **Create Database** → Redis → the region nearest Tokyo.
2. From the database page, the **REST API** panel:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

Three submissions per hour per hashed IP. If Upstash is unreachable the action
returns an error rather than letting the message through — it fails closed, so
an outage never turns the form into an open relay.

## 4. Wire it up

```bash
cp .env.example .env.local   # then fill in the seven values
pnpm dev
```

The form appears at the bottom of the CONTACT section once all seven are set.

Then the same seven in **Vercel → Settings → Environment Variables**, for
Production *and* Preview.

> **You must redeploy afterwards, and setting the variables does not do it.**
> The page is statically prerendered, so `isContactConfigured()` runs at build
> time and the form's presence is baked into the HTML. Env vars added after a
> build have no effect on it until the next one.
>
> **Vercel → Deployments → ⋯ on the latest → Redeploy**, and leave "Use existing
> Build Cache" unticked. Pushing any commit works too.

## 5. Verify in production — this is stage 6's Definition of Done

1. Send yourself a real message from the live site.
2. It arrives in the `CONTACT_TO_EMAIL` inbox, and **Reply** addresses the
   sender rather than Resend.
3. The row is in Supabase: **Table Editor → contact_submissions**. Check
   `ip_hash` is a hash and not an address.
4. Send three more from the same network. The fourth is refused with the
   rate-limit message, in whichever locale you were on.
5. Tick the Stage 6 boxes in `docs/PROGRESS.md`.

## If something breaks

**The form does not appear** — one of the seven is missing or blank. Blank
counts as missing; that is what broke the stage 0 Vercel build.

**"TRANSMISSION FAILED"** — the message may still be safely in Supabase; the
action stores before it sends, precisely so a Resend outage costs nothing.
Check the table first, then the server logs.

**Mail goes to spam** — expected from `onboarding@resend.dev`. Fixed by the
domain verification in step 2.4.
