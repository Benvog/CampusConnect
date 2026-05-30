-- Create fake student profiles for testing
-- Run this in Supabase SQL Editor

-- Get Kabarak University ID
with kabarak as (
  select id from public.universities where short_name = 'KABU' limit 1
)

-- Insert fake profiles (these will fail if auth users don't exist, but that's OK for testing)
insert into public.profiles (
  id, display_name, gender, university_id, faculty, year_of_study, 
  bio, photos, interests, is_verified_student, is_email_verified, 
  relationship_intent, swipe_count_today
)
select 
  gen_random_uuid(),
  display_name,
  gender,
  (select id from kabarak),
  faculty,
  year_of_study,
  bio,
  photos,
  interests,
  true,
  true,
  relationship_intent,
  0
from (values
  ('Sarah Kimani', 'female', 'Computer Science', 2, 'Love coding and coffee ☕️', ARRAY['coding', 'coffee', 'movies'], ARRAY['friendship', 'serious']),
  ('James Ochieng', 'male', 'Engineering', 4, 'Future engineer. Love hiking 🏔️', ARRAY['hiking', 'sports', 'music'], ARRAY['casual', 'open']),
  ('Grace Muthoni', 'female', 'Business', 3, 'Entrepreneur in the making 💼', ARRAY['business', 'travel', 'reading'], ARRAY['serious']),
  ('David Kamau', 'male', 'Medicine', 5, 'Med student. Saving lives 💉', ARRAY['medicine', 'fitness', 'volunteering'], ARRAY['friendship', 'serious']),
  ('Faith Wanjiku', 'female', 'Law', 3, 'Future lawyer. Love debates ⚖️', ARRAY['law', 'debate', 'writing'], ARRAY['open']),
  ('Peter Njoroge', 'male', 'Arts', 2, 'Artist. Creative soul 🎨', ARRAY['art', 'music', 'photography'], ARRAY['casual', 'friendship']),
  ('Mary Akinyi', 'female', 'Science', 1, 'Science nerd. Love nature 🔬', ARRAY['science', 'nature', 'gaming'], ARRAY['friendship']),
  ('John Maina', 'male', 'Education', 4, 'Future teacher. Patient & kind 📚', ARRAY['teaching', 'sports', 'family'], ARRAY['serious'])
) as fake(display_name, gender, faculty, year_of_study, bio, interests, relationship_intent)
returning id, display_name;
