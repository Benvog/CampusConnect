-- Add test student profiles for Kabarak University
-- Run in Supabase SQL Editor

-- 1. Create auth users first (with .ac.ke emails)
insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data)
select 
  gen_random_uuid(),
  'student' || idx || '@kabarak.ac.ke',
  now(),
  '{"display_name": "Student ' || idx || '"}'::jsonb
from generate_series(1, 8) as idx
on conflict do nothing
returning id, email;
