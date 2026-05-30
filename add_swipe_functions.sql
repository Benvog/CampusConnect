-- Add swipe counter functions
-- Run this in Supabase SQL Editor

-- Function to increment swipe count
CREATE OR REPLACE FUNCTION increment_swipe_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET swipe_count_today = COALESCE(swipe_count_today, 0) + 1,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has swipes remaining
CREATE OR REPLACE FUNCTION has_swipes_remaining(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  swipe_count INTEGER;
  max_swipes INTEGER := 15; -- Free tier limit
BEGIN
  -- Get user's subscription tier and swipe count
  SELECT subscription_tier, COALESCE(swipe_count_today, 0)
  INTO user_tier, swipe_count
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- CampusPlus users have unlimited swipes
  IF user_tier = 'campus_plus' THEN
    RETURN TRUE;
  END IF;
  
  -- Free users get 15 swipes per day
  RETURN swipe_count < max_swipes;
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily swipes (run this at midnight via cron)
CREATE OR REPLACE FUNCTION reset_daily_swipes()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET swipe_count_today = 0,
      daily_swipe_reset = NOW()
  WHERE daily_swipe_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Verify functions work
SELECT 'Functions created successfully' as status;
