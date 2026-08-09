create table daily_counters (
  queue_date date primary key,
  next_number int not null default 1
);

alter table daily_counters enable row level security;