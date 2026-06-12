CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid();
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.get_my_role() TO authenticated;

DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;