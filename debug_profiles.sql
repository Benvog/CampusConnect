-- Debug: Check why profiles aren't showing in discovery
-- Run this in Supabase SQL Editor

-- 1. Check if profiles exist
select p.id, p.display_name, p.university_id, p.is_verified_student, p.is_email_verified, p.profile_visible, u.email
from public.profiles p
join auth.users u on p.id = u.id
where u.email like '%@kabarak.ac.ke';

-- 2. Check your user's ID (the one logged in)
-- Replace with your actual user email
select id from auth.users where email = 'test@kabarak.ac.ke';

-- 3. Check if profiles are being excluded (already swiped, blocked, etc.)
-- Replace YOUR_USER_ID with your actual user ID from query 2
select 'Already swiped' as reason, swiped_id as profile_id from public.swipes where swiper_id = 'YOUR_USER_ID'
union all
select 'Blocked' as reason, blocked_id as profile_id from public.blocks where blocker_id = 'YOUR_USER_ID';
