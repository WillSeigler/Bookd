-- Add headliner field to individual_profiles table
-- This will store the user's professional tagline/headline

ALTER TABLE public.individual_profiles 
ADD COLUMN headliner TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.individual_profiles.headliner IS 'Professional headline or tagline displayed prominently on profile';