-- STEP 4 + 7: run this in Supabase -> SQL Editor -> New query -> Run.

-- One row per person on the waitlist.
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  -- Links the row to the logged-in Supabase user. Used by the RLS rules below.
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  -- UNIQUE blocks duplicate emails. The upsert in the callback route relies on this.
  email      text not null unique,
  name       text,
  created_at timestamptz not null default now()
);

-- STEP 7: Row Level Security. With RLS on and no policies, NOBODY can read or write.
alter table public.waitlist enable row level security;

-- auth.uid() = the id of the logged-in user making the request.
-- Each policy says: "only if the row's user_id is you".
create policy "users read own row"
  on public.waitlist for select
  using (auth.uid() = user_id);

create policy "users insert own row"
  on public.waitlist for insert
  with check (auth.uid() = user_id);

-- The upsert becomes an UPDATE when the email already exists, so allow that too.
create policy "users update own row"
  on public.waitlist for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
