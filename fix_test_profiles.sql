-- Create working test profiles (run this in Supabase SQL Editor)

-- Step 1: Get your user ID and Kabarak ID first
with your_user as (
  select id from auth.users where email = 'test@kabarak.ac.ke' limit 1
),
kabarak_uni as (
  select id from public.universities where short_name = 'KABU' limit 1
)

-- Step 2: Create auth users for fake students (if not exist)
insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data)
select 
  gen_random_uuid(),
  email,
  now(),
  '{"provider":"email"}'::jsonb
from (values 
  ('sarah@kabarak.ac.ke'),
  ('james@kabarak.ac.ke'),
  ('grace@kabarak.ac.ke'),
  ('david@kabarak.ac.ke'),
  ('faith@kabarak.ac.ke')
) as v(email)
where not exists (select 1 from auth.users where users.email = v.email);

-- Step 3: Create their profiles (this will actually work)
insert into public.profiles (
  id, display_name, gender, university_id, faculty, year_of_study,
  bio, photos, interests, is_verified_student, is_email_verified,
  relationship_intent, profile_visible, swipe_count_today
)
select 
  u.id,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Sarah Kimani'
    when 'james@kabarak.ac.ke' then 'James Ochieng'
    when 'grace@kabarak.ac.ke' then 'Grace Muthoni'
    when 'david@kabarak.ac.ke' then 'David Kamau'
    when 'faith@kabarak.ac.ke' then 'Faith Wanjiku'
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'female'
    when 'james@kabarak.ac.ke' then 'male'
    when 'grace@kabarak.ac.ke' then 'female'
    when 'david@kabarak.ac.ke' then 'male'
    when 'faith@kabarak.ac.ke' then 'female'
  end,
  (select id from public.universities where short_name = 'KABU'),
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Computer Science'
    when 'james@kabarak.ac.ke' then 'Engineering'
    when 'grace@kabarak.ac.ke' then 'Business'
    when 'david@kabarak.ac.ke' then 'Medicine'
    when 'faith@kabarak.ac.ke' then 'Law'
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 2
    when 'james@kabarak.ac.ke' then 4
    when 'grace@kabarak.ac.ke' then 3
    when 'david@kabarak.ac.ke' then 5
    when 'faith@kabarak.ac.ke' then 3
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Love coding and coffee ☕️'
    when 'james@kabarak.ac.ke' then 'Future engineer. Love hiking 🏔️'
    when 'grace@kabarak.ac.ke' then 'Entrepreneur in the making 💼'
    when 'david@kabarak.ac.ke' then 'Med student. Saving lives 💉'
    when 'faith@kabarak.ac.ke' then 'Future lawyer. Love debates ⚖️'
  end,
  array[]::text[],
  case u.email
    when 'sarah@kabarak.ac.ke' then array['coding', 'coffee', 'movies']
    when 'james@kabarak.ac.ke' then array['hiking', 'sports', 'music']
    when 'grace@kabarak.ac.ke' then array['business', 'travel', 'reading']
    when 'david@kabarak.ac.ke' then array['medicine', 'fitness', 'volunteering']
    when 'faith@kabarak.ac.ke' then array['law', 'debate', 'writing']
  end,
  true,  -- is_verified_student
  true,  -- is_email_verified
  'friendship',  -- relationship_intent
  true,  -- profile_visible
  0      -- swipe_count_today
from auth.users u
where u.email in ('sarah@kabarak.ac.ke', 'james@kabarak.ac.ke', 'grace@kabarak.ac.ke', 'david@kabarak.ac.ke', 'faith@kabarak.ac.ke')
  and not exists (select 1 from public.profiles p where p.id = u.id)
returning display_name, faculty, is_verified_student, profile_visible;
