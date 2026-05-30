-- Verify the test user manually
-- Run this in Supabase SQL Editor

-- Confirm email in auth
update auth.users 
set email_confirmed_at = now()
where email = 'test@kabarak.ac.ke';

-- Update profile
update public.profiles
set is_email_verified = true,
    verification_date = now()
where id in (select id from auth.users where email = 'test@kabarak.ac.ke');

-- Check result
select email, email_confirmed_at from auth.users where email = 'test@kabarak.ac.ke';
