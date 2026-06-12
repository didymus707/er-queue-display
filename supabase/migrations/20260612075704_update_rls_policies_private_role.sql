-- Drop all policies that reference the old public get_my_role()
DROP POLICY IF EXISTS "receptionist can read patients table" ON patients;
DROP POLICY IF EXISTS "receptionist can add to a patients table" ON patients;
DROP POLICY IF EXISTS "receptionist can update a patients table" ON patients;
DROP POLICY IF EXISTS "receptionist can read queue entries table" ON queue_entries;
DROP POLICY IF EXISTS "receptionist can add to a queue entries table" ON queue_entries;
DROP POLICY IF EXISTS "receptionist can update a queue entries table" ON queue_entries;
DROP POLICY IF EXISTS "doctors can read patients table" ON patients;
DROP POLICY IF EXISTS "doctor can read queue entries table" ON queue_entries;
DROP POLICY IF EXISTS "doctors can update a queue entries table" ON queue_entries;

-- Recreate referencing private.get_my_role()
CREATE POLICY "receptionist can read patients table"
ON patients 
FOR SELECT 
TO authenticated
USING (private.get_my_role() = 'receptionist');

CREATE POLICY "receptionist can add to a patients table"
ON patients 
FOR INSERT 
TO authenticated
WITH CHECK (private.get_my_role() = 'receptionist');

CREATE POLICY "receptionist can update a patients table"
ON patients 
FOR UPDATE 
TO authenticated
USING (private.get_my_role() = 'receptionist');

CREATE POLICY "receptionist can read queue entries table"
ON queue_entries 
FOR SELECT 
TO authenticated
USING (private.get_my_role() = 'receptionist');

CREATE POLICY "receptionist can add to a queue entries table"
ON queue_entries 
FOR INSERT 
TO authenticated
WITH CHECK (private.get_my_role() = 'receptionist');

CREATE POLICY "receptionist can update a queue entries table"
ON queue_entries 
FOR UPDATE 
TO authenticated
USING (private.get_my_role() = 'receptionist');

CREATE POLICY "doctors can read patients table"
ON patients 
FOR SELECT 
TO authenticated
USING (private.get_my_role() = 'doctor');

CREATE POLICY "doctor can read queue entries table"
ON queue_entries 
FOR SELECT 
TO authenticated
USING (private.get_my_role() = 'doctor');

CREATE POLICY "doctors can update a queue entries table"
ON queue_entries 
FOR UPDATE 
TO authenticated
USING (private.get_my_role() = 'doctor');