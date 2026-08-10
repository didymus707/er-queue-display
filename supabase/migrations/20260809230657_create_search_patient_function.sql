create or replace function public.search_patients(p_query text)
returns table(id uuid, name text, date_of_birth date, last_visit timestamptz)
language sql
security invoker set search_path = ''
as $$
  select p.id, 
  p.name, 
  p.date_of_birth, 
  max(q.checked_in_at) as last_visit
  from public.patients as p
  inner join public.queue_entries as q on q.patient_id = p.id
    where p.name ilike p_query || '%'
    group by p.id, p.name, p.date_of_birth
    order by last_visit desc nulls last, p.name asc
    limit 10;
$$;

revoke execute on function public.search_patients(text) from public, anon;
grant execute on function public.search_patients(text) to authenticated;