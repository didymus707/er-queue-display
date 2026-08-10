create or replace function public.check_in_patient(p_name text,
  p_date_of_birth date,
  p_reason_for_visit text,
  p_patient_id uuid)
returns public.queue_entries
language sql
security definer set search_path = ''
as $$
  select private.check_in_patient(p_name, p_date_of_birth, p_reason_for_visit, p_patient_id);
$$;

revoke execute on function public.check_in_patient(p_name text, p_date_of_birth date, p_reason_for_visit text, p_patient_id uuid) from public, anon;
grant execute on function public.check_in_patient(p_name text, p_date_of_birth date, p_reason_for_visit text, p_patient_id uuid) to authenticated;

revoke usage on schema private from public, anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;