-- Debug: Why aren't profiles showing in discovery?
-- Run this in Supabase SQL Editor

-- 1. Check YOUR profile's university_id
select p.id, p.display_name, p.university_id, p.is_verified_student, p.profile_visible, p.is_email_verified, u.email
from public.profiles p
join auth.users u on p.id = u.id
where u.email = 'test@kabarak.ac.ke';  -- Your email

-- 2. Check test profiles' university_id
select p.id, p.display_name, p.university_id, p.is_verified_student, p.profile_visible, p.is_email_verified, u.email
from public.profiles p
join auth.users u on p.id = u.id
where u.email in ('sarah@kabarak.ac.ke', 'james@kabarak.ac.ke', 'grace@kabarak.ac.ke');

-- 3. Check if universities match
select id, name, short_name from public.universities;
