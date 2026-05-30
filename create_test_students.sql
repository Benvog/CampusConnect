-- COMPLETE: Create fake students with profiles for testing
-- Run this in Supabase SQL Editor

-- Step 1: Create auth users (login accounts)
insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data)
select 
  gen_random_uuid(),
  email,
  now(),
  '{"provider":"email"}'::jsonb
from (values 
  ('sarah@kabarak.ac.ke'),
  ('james@kabarak.ac.ke'),
  ('grace@kabarak.ac.ke')
) as v(email)
where not exists (select 1 from auth.users where email = v.email)
returning id, email;
