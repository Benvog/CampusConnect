-- Create fake students for testing the swipe feature
-- Run this in Supabase SQL Editor

-- Step 1: Create auth users (these are the login accounts)
insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values 
  (gen_random_uuid(), 'sarah@kabarak.ac.ke', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb),
  (gen_random_uuid(), 'james@kabarak.ac.ke', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb),
  (gen_random_uuid(), 'grace@kabarak.ac.ke', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb),
  (gen_random_uuid(), 'david@kabarak.ac.ke', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb),
  (gen_random_uuid(), 'faith@kabarak.ac.ke', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb)
on conflict do nothing;

-- Step 2: Create their profiles
with new_users as (
  select id, email from auth.users 
  where email in ('sarah@kabarak.ac.ke', 'james@kabarak.ac.ke', 'grace@kabarak.ac.ke', 'david@kabarak.ac.ke', 'faith@kabarak.ac.ke')
),
kabarak_id as (
  select id as uni_id from public.universities where short_name = 'KABU' limit 1
)
insert into public.profiles (
  id, display_name, gender, university_id, faculty, year_of_study,
  bio, photos, interests, is_verified_student, is_email_verified,
  relationship_intent, profile_visible
)
select 
  nu.id,
  case nu.email
    when 'sarah@kabarak.ac.ke' then 'Sarah Kimani'
    when 'james@kabarak.ac.ke' then 'James Ochieng'
    when 'grace@kabarak.ac.ke' then 'Grace Muthoni'
    when 'david@kabarak.ac.ke' then 'David Kamau'
    when 'faith@kabarak.ac.ke' then 'Faith Wanjiku'
  end,
  case nu.email
    when 'sarah@kabarak.ac.ke' then 'female'
    when 'james@kabarak.ac.ke' then 'male'
    when 'grace@kabarak.ac.ke' then 'female'
    when 'david@kabarak.ac.ke' then 'male'
    when 'faith@kabarak.ac.ke' then 'female'
  end,
  (select uni_id from kabarak_id),
  case nu.email
    when 'sarah@kabarak.ac.ke' then 'Computer Science'
    when 'james@kabarak.ac.ke' then 'Engineering'
    when 'grace@kabarak.ac.ke' then 'Business'
    when 'david@kabarak.ac.ke' then 'Medicine'
    when 'faith@kabarak.ac.ke' then 'Law'
  end,
  case nu.email
    when 'sarah@kabarak.ac.ke' then 2
    when 'james@kabarak.ac.ke' then 4
    when 'grace@kabarak.ac.ke' then 3
    when 'david@kabarak.ac.ke' then 5
    when 'faith@kabarak.ac.ke' then 3
  end,
  case nu.email
    when 'sarah@kabarak.ac.ke' then 'Love coding and coffee ☕️'
    when 'james@kabarak.ac.ke' then 'Future engineer. Love hiking 🏔️'
    when 'grace@kabarak.ac.ke' then 'Entrepreneur in the making 💼'
    when 'david@kabarak.ac.ke' then 'Med student. Saving lives 💉'
    when 'faith@kabarak.ac.ke' then 'Future lawyer. Love debates ⚖️'
  end,
  array[]::text[],
  case nu.email
    when 'sarah@kabarak.ac.ke' then array['coding', 'coffee', 'movies']
    when 'james@kabarak.ac.ke' then array['hiking', 'sports', 'music']
    when 'grace@kabarak.ac.ke' then array['business', 'travel', 'reading']
    when 'david@kabarak.ac.ke' then array['medicine', 'fitness', 'volunteering']
    when 'faith@kabarak.ac.ke' then array['law', 'debate', 'writing']
  end,
  true,
  true,
  case nu.email
    when 'sarah@kabarak.ac.ke' then 'friendship'
    when 'james@kabarak.ac.ke' then 'casual'
    when 'grace@kabarak.ac.ke' then 'serious'
    when 'david@kabarak.ac.ke' then 'serious'
    when 'faith@kabarak.ac.ke' then 'open'
  end,
  true
from new_users nu
on conflict (id) do nothing;

-- Verify
select p.display_name, p.faculty, p.year_of_study, u.email
from public.profiles p
join auth.users u on p.id = u.id
where u.email like '%@kabarak.ac.ke';
