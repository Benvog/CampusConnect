-- Test if swipe functions work
-- Get your user ID first
select id from auth.users where email = 'test@kabarak.ac.ke';

-- Then test the function (replace USER_ID with your actual ID)
select has_swipes_remaining('USER_ID'::uuid);

-- Check current swipe count
select swipe_count_today, subscription_tier from public.profiles 
where id = (select id from auth.users where email = 'test@kabarak.ac.ke');
