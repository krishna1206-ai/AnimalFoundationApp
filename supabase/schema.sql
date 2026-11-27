-- Animal Foundation: shared database for the client and admin apps.
-- Run this once in Supabase → SQL Editor → New query → Run.

-- 1) Requests sent from the client app's Contact form
create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('help', 'contact')),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null check (char_length(email) between 3 and 320),
  phone       text check (char_length(phone) <= 50),
  subject     text not null check (char_length(subject) between 1 and 300),
  message     text not null check (char_length(message) between 1 and 5000),
  location    text check (char_length(location) <= 300),
  status      text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  notes       text,
  created_at  timestamptz not null default now()
);

-- 2) Who is allowed into the admin app (add the owner's user id here, see README)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.requests enable row level security;
alter table public.admins   enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Public (client app, not logged in): may ONLY send a new request. Cannot read anything.
drop policy if exists "public can submit requests" on public.requests;
create policy "public can submit requests" on public.requests
  for insert to anon, authenticated
  with check (status = 'new' and notes is null);

-- Admins: read, update and delete requests
drop policy if exists "admins read requests" on public.requests;
create policy "admins read requests" on public.requests
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update requests" on public.requests;
create policy "admins update requests" on public.requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete requests" on public.requests;
create policy "admins delete requests" on public.requests
  for delete to authenticated using (public.is_admin());

-- A logged-in user can check whether they are an admin
drop policy if exists "users see own admin row" on public.admins;
create policy "users see own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Live updates: new requests appear in the admin app instantly
do $$ begin
  alter publication supabase_realtime add table public.requests;
exception when duplicate_object then null; end $$;
