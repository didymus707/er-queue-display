create table queue_entries(
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  initials text not null,
  queue_number integer not null,
  status text not null check(status in ('waiting', 'called', 'recalled', 'done')),
  room text,
  checked_in_at timestamptz not null default now(),
  reason_for_visit text not null,
  seen_by_doctor uuid references auth.users(id),
  diagnosis text,
  notes text
);
alter table queue_entries enable row level security;