-- Security hardening migration
-- Run in Supabase SQL editor after the existing migrations.

-- ── Stop unauthenticated tampering on deals ───────────────────────────────────
-- The live database has permissive "_anon" policies on public.deals that were
-- never represented in the repo's SQL files (drift between repo and live DB):
--   select_deals_anon  using (true)
--   insert_deals_anon  with check (true)
--   update_deals_anon  using (true) with check (true)
--   delete_deals_anon  using (true)
-- Because RLS policies are OR'd, these override every other policy on the
-- table and grant full unauthenticated read/write/delete via the anon key.
-- The app has no real Supabase Auth session yet, so the auth.email()-gated
-- policies underneath always evaluate to false - meaning the app's actual
-- production deals access currently depends entirely on select_deals_anon.
--
-- Drop the write/delete anon policies now (stops tampering/destruction of
-- real deal data) and keep select_deals_anon for the moment so the app
-- keeps working. Close the remaining read hole when real auth lands.
drop policy if exists "insert_deals_anon" on public.deals;
drop policy if exists "update_deals_anon" on public.deals;
drop policy if exists "delete_deals_anon" on public.deals;

-- ── Lock down approved_emails ─────────────────────────────────────────────────
-- The original select policy was `auth.role() = 'anon' or true`, a tautology
-- that granted public SELECT on the whole table (emails + is_admin flags) to
-- any caller, including unauthenticated requests using the anon key.
--
-- The app doesn't use real Supabase Auth sessions yet (auth.email() is always
-- null today), so a row-level policy keyed on auth.email() can't gate access
-- without breaking login entirely. Instead: deny ALL direct client access to
-- this table and expose narrow SECURITY DEFINER RPCs that return only what's
-- needed (one row's approval status, or the full list/mutations but only to
-- an already-approved admin). This keeps today's trust model (admin status
-- is decided by what's already in the table) but closes the bulk-read leak.

drop policy if exists "select_approved_emails_for_auth" on public.approved_emails;
drop policy if exists "insert_approved_emails_service_role" on public.approved_emails;
-- No select/insert/update/delete policies are (re)created here on purpose:
-- with RLS enabled and zero policies, all client access (anon + authenticated)
-- is denied. Only service_role (which bypasses RLS) and the RPCs below
-- (SECURITY DEFINER) can read or write this table.

create or replace function public.check_approved_email(check_email text)
returns table(approved boolean, role text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return query
    select true,
           coalesce(ae.role, case when ae.is_admin then 'admin' else 'viewer' end)
    from public.approved_emails ae
    where ae.email = lower(check_email)
    limit 1;
end;
$$;

revoke all on function public.check_approved_email(text) from public;
grant execute on function public.check_approved_email(text) to anon, authenticated;

-- NOTE: deliberately not adding "list/add/remove approved emails" RPCs that
-- take a client-supplied "requesting_email" as their admin check. That
-- parameter can't be trusted without a real authenticated session backing
-- it - any caller with the anon key could pass admin@... as the argument
-- and grant themselves admin. The admin email-management screen in the app
-- already had no working insert/update/delete policy here, so it was a
-- dead feature before this migration; it stays dead until the Supabase Auth
-- migration lands, at which point these RPCs can be rebuilt to check
-- auth.email() / auth.uid() instead of a spoofable text argument.

-- ── Harden set_updated_at trigger function ────────────────────────────────────
-- Pin search_path so the function cannot be hijacked by a malicious schema
-- earlier in an unqualified search_path (defense in depth; this function
-- does no dynamic SQL today).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
