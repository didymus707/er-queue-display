create or replace function get_my_role()
returns text as $$
  select role from user_roles where user_id = auth.uid();
$$ language sql security definer;

create policy "public display can select queue entries"
on queue_entries
for select
to anon
using (true);

create policy "receptionist can read patients table"
on patients
for select
to authenticated
using(get_my_role() = 'receptionist');

create policy "receptionist can add to a patients table"
on patients
for insert
to authenticated
with check(get_my_role() = 'receptionist');

create policy "receptionist can update a patients table"
on patients
for update
to authenticated
using(get_my_role() = 'receptionist');

create policy "receptionist can read queue entries table"
on queue_entries
for select
to authenticated
using(get_my_role() = 'receptionist');

create policy "receptionist can add to a queue entries table"
on queue_entries
for insert
to authenticated
with check(get_my_role() = 'receptionist');

create policy "receptionist can update a queue entries table"
on queue_entries
for update
to authenticated
using(get_my_role() = 'receptionist');

create policy "doctors can read patients table"
on patients
for select
to authenticated
using(get_my_role() = 'doctor');

create policy "doctor can read queue entries table"
on queue_entries
for select
to authenticated
using(get_my_role() = 'doctor');

create policy "doctors can update a queue entries table"
on queue_entries
for update
to authenticated
using(get_my_role() = 'doctor');