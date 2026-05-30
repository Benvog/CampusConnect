-- Step 2: Create profiles for existing auth users
insert into public.profiles (
  id, display_name, gender, university_id, faculty, year_of_study,
  bio, photos, interests, is_verified_student, is_email_verified,
  relationship_intent, profile_visible
)
select 
  u.id,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Sarah Kimani'
    when 'james@kabarak.ac.ke' then 'James Ochieng'
    when 'grace@kabarak.ac.ke' then 'Grace Muthoni'
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'female'
    when 'james@kabarak.ac.ke' then 'male'
    when 'grace@kabarak.ac.ke' then 'female'
  end,
  (select id from public.universities where short_name = 'KABU' limit 1),
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Computer Science'
    when 'james@kabarak.ac.ke' then 'Engineering'
    when 'grace@kabarak.ac.ke' then 'Business'
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 2
    when 'james@kabarak.ac.ke' then 4
    when 'grace@kabarak.ac.ke' then 3
  end,
  case u.email
    when 'sarah@kabarak.ac.ke' then 'Love coding and coffee ☕️'
    when 'james@kabarak.ac.ke' then 'Future engineer. Love hiking 🏔️'
    when 'grace@kabarak.ac.ke' then 'Entrepreneur in the making 💼'
  end,
  array[]::text[],
  case u.email
    when 'sarah@kabarak.ac.ke' then array['coding', 'coffee', 'movies']
    when 'james@kabarak.ac.ke' then array['hiking', 'sports', 'music']
    when 'grace@kabarak.ac.ke' then array['business', 'travel', 'reading']
  end,
  true,
  true,
  'friendship',
  true
from auth.users u
where u.email in ('sarah@kabarak.ac.ke', 'james@kabarak.ac.ke', 'grace@kabarak.ac.ke')
  and not exists (select 1 from public.profiles p where p.id = u.id)
returning display_name, faculty;
