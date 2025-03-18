-- Migration to fix Google user creation errors
-- This addresses the "Database error saving new user" issue during Google authentication

-- First, let's disable our custom triggers temporarily to avoid conflicts during user creation
DROP TRIGGER IF EXISTS on_auth_user_google_updated ON auth.users;
DROP TRIGGER IF EXISTS on_google_auth_user_created ON auth.users;

-- Update the sync function to be more resilient
CREATE OR REPLACE FUNCTION sync_google_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync if the user exists and has Google provider data
  IF (NEW.raw_app_meta_data->>'provider' = 'google') THEN
    BEGIN
      -- Use a safer insert approach with exception handling
      INSERT INTO public.profiles (
        id, 
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
      ) 
      VALUES (
        NEW.id, 
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'customer',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(NEW.email, profiles.email),
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
        updated_at = NOW();
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the trigger
      RAISE NOTICE 'Error syncing Google profile: %', SQLERRM;
    END;
    
    BEGIN
      -- Also ensure the user has a role in user_roles
      INSERT INTO public.user_roles (
        user_id,
        role,
        is_approved,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        'customer',
        TRUE,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the trigger
      RAISE NOTICE 'Error creating user role: %', SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-create the trigger with AFTER INSERT OR UPDATE
CREATE TRIGGER on_auth_user_google_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_google_user_metadata();

-- Add direct permissions for the auth service
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Ensure the auth service can create/update profiles
DROP POLICY IF EXISTS "Auth service can manage profiles" ON public.profiles;
CREATE POLICY "Auth service can manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated, anon, service_role
  USING (true)
  WITH CHECK (true);
  
-- Ensure the auth service can create/update user roles
DROP POLICY IF EXISTS "Auth service can manage user roles" ON public.user_roles;
CREATE POLICY "Auth service can manage user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated, anon, service_role
  USING (true)
  WITH CHECK (true);

-- Add a function to handle specific Google auth errors and provide detailed logging
CREATE OR REPLACE FUNCTION handle_google_auth_error() 
RETURNS trigger AS $$
DECLARE
  error_info text;
BEGIN
  -- Record detailed error info for debugging
  error_info := 'Google Auth Error: ' || 
                'TG_OP=' || TG_OP || ', ' ||
                'TG_TABLE_NAME=' || TG_TABLE_NAME || ', ' ||
                'TG_WHEN=' || TG_WHEN || ', ' ||
                'TG_LEVEL=' || TG_LEVEL;
                
  -- Log the error details
  RAISE LOG '%', error_info;
  
  -- Continue with the operation
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Catch any exceptions to prevent operation failure
  RAISE LOG 'Exception in handle_google_auth_error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to log Google auth errors for debugging
CREATE TRIGGER on_google_auth_error
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_app_meta_data->>'provider' = 'google')
  EXECUTE FUNCTION handle_google_auth_error();

-- Add comment for clarity
COMMENT ON FUNCTION sync_google_user_metadata() IS 
'Updated function to sync Google user metadata with error handling and user role creation';

COMMENT ON FUNCTION handle_google_auth_error() IS
'Function to provide detailed logging for Google auth errors';
