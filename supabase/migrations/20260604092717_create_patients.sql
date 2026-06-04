create table patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer,
  created_at timestamptz not null default now()
);
alter table patients enable row level security;