-- Stage 6 — contact submission storage.
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste ->
-- Run. It is idempotent, so re-running it is safe.
--
-- Every submission is inserted here BEFORE the notification email is sent, so
-- a Resend outage never loses an enquiry. See src/app/actions/contact.ts.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  locale      text not null,
  -- HMAC-SHA256 of the caller's IP. Never the address itself: this table is a
  -- job-search side effect, not a log, and it should not accumulate personal
  -- data it has no use for. The hash is enough to recognise a repeat sender.
  ip_hash     text not null,
  created_at  timestamptz not null default now()
);

-- The same bounds the Zod schema enforces (src/lib/contact-contract.ts). Duplicated on
-- purpose: the schema protects the form, these protect the table from anything
-- that ever reaches it another way.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_submissions_name_len') then
    alter table public.contact_submissions
      add constraint contact_submissions_name_len check (char_length(name) between 1 and 80);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_submissions_email_len') then
    alter table public.contact_submissions
      add constraint contact_submissions_email_len check (char_length(email) between 3 and 160);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_submissions_message_len') then
    alter table public.contact_submissions
      add constraint contact_submissions_message_len check (char_length(message) between 20 and 2000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_submissions_locale') then
    alter table public.contact_submissions
      add constraint contact_submissions_locale check (locale in ('en', 'ja'));
  end if;
end $$;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- RLS on with DELIBERATELY NO POLICIES.
--
-- This is the whole security model, so it is worth being explicit: with RLS
-- enabled and zero policies, the anon and authenticated roles can neither read
-- nor write this table — a leaked anon key buys an attacker nothing. The
-- service role bypasses RLS entirely, and the server action is the only holder
-- of that key. Do not "fix" the missing insert policy; its absence is the point.
alter table public.contact_submissions enable row level security;

revoke all on public.contact_submissions from anon, authenticated;
