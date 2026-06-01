-- ─── EXTENSIONS ───────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── TABLE: students ──────────────────────────────────────
create table if not exists students (
  id              uuid primary key default gen_random_uuid(),
  nim             varchar(20) unique not null,
  name            varchar(150) not null,
  role            varchar(10) not null default 'student'
                  check (role in ('student', 'admin')),
  specialization  varchar(50) not null
                  check (specialization in ('Business Intelligence', 'Smart Agriculture')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── TABLE: milestones ────────────────────────────────────
create table if not exists milestones (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references students(id) on delete cascade unique,
  proposal    boolean default false,
  seminar     boolean default false,   -- SemPro
  defense     boolean default false,   -- SemHas
  graduation  boolean default false,   -- Wisuda
  updated_at  timestamptz default now(),
  updated_by  uuid references students(id)
);

-- ─── TABLE: profiles ──────────────────────────────────────
create table if not exists profiles (
  id                      uuid primary key default gen_random_uuid(),
  student_id              uuid references students(id) on delete cascade unique,
  quote                   text default 'Perjalanan menuju S.Kom dimulai dari satu langkah pertama.',
  avatar_url              text,
  avatar_cloudinary_id    text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ─── TABLE: memories ──────────────────────────────────────
create table if not exists memories (
  id              uuid primary key default gen_random_uuid(),
  title           varchar(200) not null,
  caption         text,
  category        varchar(50) not null
                  check (category in ('Struggle', 'Friendship', 'Academic', 'Graduation', 'Lainnya')),
  event_date      date,
  location        varchar(200),
  cloudinary_url  text not null,
  cloudinary_id   text not null,
  grid_span       varchar(100),
  uploaded_by     uuid references students(id),
  is_featured     boolean default false,
  created_at      timestamptz default now()
);

-- ─── TABLE: password_registry ─────────────────────────────
-- NOTE: MVP only. Production sebaiknya pakai Supabase Auth.
create table if not exists password_registry (
  student_id    uuid references students(id) on delete cascade primary key,
  password_hash text not null  -- Di-hash dengan bcrypt (cost=12)
);

-- ─── TRIGGER: auto-update updated_at ──────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger students_updated_at
  before update on students
  for each row execute function update_updated_at();

create trigger milestones_updated_at
  before update on milestones
  for each row execute function update_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────

-- students: baca publik, update sendiri saja
alter table students enable row level security;

create policy "Anyone can view students"
  on students for select using (true);

-- milestones: baca publik, update hanya admin
alter table milestones enable row level security;

create policy "Anyone can view milestones"
  on milestones for select using (true);

-- profiles: baca publik, update sendiri saja
alter table profiles enable row level security;

create policy "Anyone can view profiles"
  on profiles for select using (true);

-- memories: baca publik
alter table memories enable row level security;

create policy "Anyone can view memories"
  on memories for select using (true);

-- password_registry: tidak ada akses dari client (hanya via service role)
alter table password_registry enable row level security;
-- Tidak ada policy publik → semua akses harus lewat service role key (API Routes)
