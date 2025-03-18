-- Migration to fix Google authentication profile creation issues
-- This migration addresses permission issues with profile creation and updates the sync_google_user_metadata function

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_google_updated ON auth.users;

-- Update the function to include the role field and improve permissions
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
      role,  -- Added role field with default 'customer'
      created_at,
      updated_at
    ) 
    VALUES (
      NEW.id, 
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url',
      'customer',  -- Default role for new users
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
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- Added SECURITY DEFINER to ensure it runs with elevated privileges

-- Re-create the trigger
CREATE TRIGGER on_auth_user_google_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_google_user_metadata();

-- Create service-role specific policy for profile creation
-- This allows the service role to create profiles during authentication
CREATE POLICY "Service role can create profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);  -- Service role can create any profile

-- Create service-role specific policy for updating profiles
CREATE POLICY "Service role can update profiles"
  ON public.profiles
  FOR UPDATE
  TO service_role
  USING (true);  -- Service role can update any profile

-- Create additional policy to ensure profiles can be created during auth callback
CREATE POLICY "Auth callback can manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix the user insertion for Google auth users
CREATE OR REPLACE FUNCTION handle_new_google_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert user_roles if user doesn't already have a role
  INSERT INTO public.user_roles (user_id, role)
  SELECT NEW.id, 'customer'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger specifically for Google auth users
DROP TRIGGER IF EXISTS on_google_auth_user_created ON auth.users;
CREATE TRIGGER on_google_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_app_meta_data->>'provider' = 'google')
  EXECUTE FUNCTION handle_new_google_user();

-- Add comment for clarity
COMMENT ON FUNCTION sync_google_user_metadata() IS 
'Updated function to sync Google user metadata to profiles with proper role assignment and security context';
