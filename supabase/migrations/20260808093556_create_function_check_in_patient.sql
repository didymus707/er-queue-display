create or replace function private.check_in_patient(
  p_name text,
  p_date_of_birth date,
  p_reason_for_visit text,
  p_patient_id uuid
)
returns public.queue_entries
language plpgsql
security definer set search_path = ''
as $$
declare
  v_name text := p_name;
  v_initials text;
  v_patient_id uuid := p_patient_id;
  v_queue_number int;
  v_row public.queue_entries;
  begin
    -- step 1 check patients id
    if v_patient_id is null then
      if v_name is null or trim(v_name) = '' then
        raise exception 'Patient name is required when patient_id is NULL';
      end if;

      insert into public.patients(name, date_of_birth)
      values(v_name, p_date_of_birth)
      returning id into v_patient_id;

    else

      select name into v_name
      from public.patients
      where id = v_patient_id;

      if not found then
        raise exception 'Patient with id % not found', v_patient_id;
      end if;
    end if;

    if position(' ' in trim(v_name)) = 0 then
      -- single word: first two letters
      v_initials := upper(substr(trim(v_name), 1, 2));
    else
      v_initials := UPPER(
        left(split_part(v_name, ' ', 1), 1) || coalesce(left(nullif(split_part(v_name, ' ', -1), ''), 1), '')
      );
    end if;

    --step 2 : atomic upsert
    insert into public.daily_counters(queue_date, last_number)
    values(current_date, 1)
    on conflict(queue_date)
    do update set last_number = public.daily_counters.last_number + 1
    returning last_number into v_queue_number;

    --step 3: insert into queue_entries
    insert into public.queue_entries(patient_id, initials, queue_number, status, reason_for_visit)
    values(v_patient_id, v_initials, v_queue_number, 'waiting', p_reason_for_visit)
    returning * into v_row;

  return v_row;
end;
$$;