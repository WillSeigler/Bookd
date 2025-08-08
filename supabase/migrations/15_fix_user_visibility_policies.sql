-- Fix user visibility for social media feed
-- Allow users to see basic profile information of other users

-- Drop the restrictive policy that only allows users to see their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- Create a new policy that allows viewing basic user profile information
-- This is necessary for social media feeds, post authors, etc.
CREATE POLICY "Users can view basic profile info" ON public.users
  FOR SELECT
  USING (
    -- Users can always see their own full profile
    auth.uid() = id OR
    -- Authenticated users can see basic info (name, avatar) of other users
    -- This enables social features like seeing post authors, followers, etc.
    (auth.role() = 'authenticated' AND id IS NOT NULL)
  );

-- Alternative: If you want more granular control, you could create a view
-- that only exposes public fields, but for social media this approach is simpler
-- and follows common patterns

-- Note: This policy allows authenticated users to see:
-- - id, email, full_name, avatar_url of other users
-- - This is standard for social media platforms
-- - Sensitive data should be kept in separate tables with stricter policies
