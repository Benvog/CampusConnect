-- Reset your swipes to test again
-- Run this in Supabase SQL Editor

delete from public.swipes 
where swiper_id = (select id from auth.users where email = 'test@kabarak.ac.ke');

-- Verify
select 'Swipes reset for test@kabarak.ac.ke' as status;
