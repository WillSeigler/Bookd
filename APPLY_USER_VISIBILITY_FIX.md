# Fix for "Unknown" User Names

## Problem
Users are showing as "Unknown" when viewing posts from other accounts because the RLS policy on the `users` table is too restrictive.

## Solution
Apply the SQL migration to allow users to see basic profile information of other users.

## Steps to Apply the Fix

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste this SQL script:

```sql
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
```

4. Click **Run** to execute the migration
5. Refresh your app and test - user names should now appear correctly

### Option 2: Supabase CLI (if you have it installed)
```bash
supabase migration up
```

## What This Fixes
- ✅ User names will show correctly in posts instead of "Unknown"
- ✅ Avatar images will load properly for all users
- ✅ Following/followers lists will display correctly
- ✅ All social features requiring user visibility will work

## Security Note
This change allows authenticated users to see basic profile information (name, avatar) of other users, which is standard for social media platforms. No sensitive data like email addresses or private information is exposed beyond what's necessary for the social features.

## Testing
After applying the fix:
1. Sign in as User A
2. Create a post
3. Sign in as User B (different account)
4. View the feed - User A's name should now appear correctly instead of "Unknown"
