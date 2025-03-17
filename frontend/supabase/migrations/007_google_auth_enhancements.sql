-- Migration to enhance support for Google authentication
-- This adds avatar_url handling for user profiles based on Google metadata

-- First, let's update the profiles table to ensure it can store avatar URLs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create a function to sync Google profile data to our profiles table
CREATE OR REPLACE FUNCTION sync_google_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a new Google user or metadata was updated
  IF (NEW.raw_app_meta_data->>'provider' = 'google') THEN
    -- Update the profile with Google profile data
    INSERT INTO public.profiles (
      id, 
      email,
      full_name,
      avatar_url,
      created_at,
      updated_at
    ) 
    VALUES (
      NEW.id, 
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync Google user data when a user is created or updated
DROP TRIGGER IF EXISTS on_auth_user_google_updated ON auth.users;
CREATE TRIGGER on_auth_user_google_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_google_user_metadata();

-- Note: OAuth callback settings should be configured through the Supabase dashboard UI
-- under Authentication → URL Configuration → Redirect URLs, not through SQL migration

-- Enhance role-specific policies for Google-authenticated users

-- Allow users to see their own avatar_url
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (id = auth.uid());

-- Allow users to update their own avatar_url
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
  
-- Comment explaining the migration
COMMENT ON FUNCTION sync_google_user_metadata() IS 
'This function syncs Google user metadata to our profiles table to ensure we have access to Google profile information like avatar URLs and full names.';
