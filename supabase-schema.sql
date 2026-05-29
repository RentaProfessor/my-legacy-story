-- MyLegacyTape database schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  family_code text unique not null default upper(substr(md5(random()::text), 1, 6)),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Anyone can look up a profile by family_code"
  on public.profiles for select using (true);

-- 2. Books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null default 'book' check (type in ('book', 'journal')),
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Creators can CRUD own books"
  on public.books for all using (auth.uid() = user_id);

create policy "Anyone can read books by family_code lookup"
  on public.books for select using (
    exists (
      select 1 from public.profiles where profiles.id = books.user_id
    )
  );

-- 3. Chapters table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  title text not null,
  order_index int not null default 0,
  transcript text not null default '',
  duration_seconds int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.chapters enable row level security;

create policy "Creators can CRUD own chapters"
  on public.chapters for all using (
    exists (
      select 1 from public.books where books.id = chapters.book_id and books.user_id = auth.uid()
    )
  );

create policy "Anyone can read chapters via book access"
  on public.chapters for select using (
    exists (
      select 1 from public.books
      join public.profiles on profiles.id = books.user_id
      where books.id = chapters.book_id
    )
  );

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Devices table (physical recorders paired to user accounts)
create table if not exists public.devices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  hardware_id   text not null unique,   -- "LT-A1B2C3" from device firmware
  pairing_token text not null,          -- 32 lowercase hex chars from QR code
  wifi_ssid     text,                   -- last known SSID, stored for diagnostics only
  paired_at     timestamptz not null default now(),
  last_seen_at  timestamptz,            -- updated by device heartbeats
  created_at    timestamptz not null default now()
);

alter table public.devices enable row level security;

create policy "Users can read own devices"
  on public.devices for select using (auth.uid() = user_id);

create policy "Users can pair a device"
  on public.devices for insert with check (auth.uid() = user_id);

create policy "Users can update own devices"
  on public.devices for update using (auth.uid() = user_id);

create policy "Users can delete own devices"
  on public.devices for delete using (auth.uid() = user_id);

create index if not exists idx_devices_user_id on public.devices(user_id);

-- Onboarding columns (populated after BLE pairing, during the survey flow)
alter table public.devices
  add column if not exists setup_for          text check (setup_for in ('self', 'other')),
  add column if not exists subject_name       text,
  add column if not exists subject_dob        date,
  add column if not exists survey_answers     jsonb,
  add column if not exists sync_requested     boolean not null default false,
  add column if not exists onboarding_complete boolean not null default false;

-- Optional: track which device recorded which book
alter table public.books
  add column if not exists device_id uuid references public.devices(id) on delete set null;

-- 6. Indexes
create index if not exists idx_books_user_id on public.books(user_id);
create index if not exists idx_chapters_book_id on public.chapters(book_id);
create index if not exists idx_profiles_family_code on public.profiles(family_code);

-- 7. Recordings table
--
-- Storage layout (both buckets must be created as PRIVATE in the Supabase dashboard):
--
--   recording_chunks  (private)
--     recording_chunks/<hardware_id>/<session_id>/<chunk_idx>.pcm
--     Raw little-endian 16-bit PCM, 16 kHz mono.  Written by upload_chunk Edge Function
--     as the device records.  Assembled + deleted by finalize_recording Edge Function.
--
--   recordings  (private)
--     <account_id>/<session_id>.wav
--     Final WAV assembled by finalize_recording from the PCM chunks.
--     The storage_path column stores this path (no bucket prefix).
--
-- Row inserted by finalize_recording Edge Function once STOP is pressed and all
-- chunks have been uploaded.
create table if not exists public.recordings (
  id               uuid        primary key default gen_random_uuid(),
  account_id       uuid        not null references auth.users(id) on delete cascade,
  session_id       text        not null unique,     -- 32-char hex, device-generated per press of REC
  book_name        text,
  chapter_idx      int         not null default 0,
  chapter_name     text,
  storage_path     text        not null unique,     -- path inside the "recordings" bucket
  duration_seconds int         not null default 0,
  transcription    text,                            -- populated async by Whisper
  transcribed_at   timestamptz,
  created_at       timestamptz not null default now()
);

create index if not exists recordings_account_id_idx on public.recordings(account_id);

alter table public.recordings enable row level security;

create policy "Users see own recordings"
  on public.recordings for select
  using (account_id = auth.uid());

create policy "Service role can insert recordings"
  on public.recordings for insert
  with check (true);

-- The iOS app writes `transcription` / `transcribed_at` back to the row after
-- running Apple SFSpeech on the downloaded WAV. Without this, the update fails
-- RLS silently and the recording stays stuck at "Transcribing…".
create policy "Users update own recordings"
  on public.recordings for update
  using (account_id = auth.uid())
  with check (account_id = auth.uid());

-- The app lets a user delete a recording (and "Remove this device" deletes all
-- of an account's recordings). Without this, those deletes fail RLS.
create policy "Users delete own recordings"
  on public.recordings for delete
  using (account_id = auth.uid());

-- Enable Realtime so the app receives new recordings + transcript updates live.
alter publication supabase_realtime add table public.recordings;

-- 8. Device status RPC
-- Called by the device (using only the anon key + its own pairing token) to poll
-- onboarding_complete without needing a user session.
-- Security: security definer lets the function bypass RLS; the pairing_token check
-- ensures a device can only read its own row.
create or replace function public.device_status(hw_id text, tok text)
returns table (onboarding_complete boolean)
language sql
security definer
stable
as $$
  select onboarding_complete
  from public.devices
  where hardware_id = hw_id
    and pairing_token = tok
  limit 1;
$$;

-- Allow the device to call this with just the anon key (no user session required).
grant execute on function public.device_status(text, text) to anon;

-- 9. Storage buckets + object RLS (created live via Management API on 2026-05-29)
-- Both buckets are PRIVATE. finalize_recording uploads via the service-role key
-- (bypasses RLS). The iOS app reads its own WAVs as the signed-in user, which
-- needs the SELECT policy below or createSignedUrl returns 403.
insert into storage.buckets (id, name, public)
  values ('recording_chunks', 'recording_chunks', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('recordings', 'recordings', false)
  on conflict (id) do nothing;

-- Path layout: recordings/<account_id>/<session_id>.wav → owner is folder[1].
drop policy if exists "Users read own recording objects" on storage.objects;
create policy "Users read own recording objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
