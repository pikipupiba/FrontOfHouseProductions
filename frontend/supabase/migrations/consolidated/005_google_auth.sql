------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 005_google_auth.sql
------------------------------------------------------------------
-- This migration creates the complete Google authentication infrastructure
-- including robust profile syncing, error handling, and debugging utilities.
------------------------------------------------------------------

------------------------------------------------------------------
-- CLEANUP FROM PREVIOUS VERSIONS
------------------------------------------------------------------

-- Disable any existing Google auth triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_google_updated ON auth.users;
DROP TRIGGER IF EXISTS on_google_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_google_auth_error ON auth.users;

-- We'll use a single comprehensive trigger approach
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

------------------------------------------------------------------
-- GOOGLE AUTH SYNC FUNCTION
------------------------------------------------------------------

-- The final, most robust version of the Google user metadata sync function
CREATE OR REPLACE FUNCTION sync_google_user_metadata()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Log raw email value from auth.users
  RAISE LOG 'sync_google_user_metadata triggered for user % with email %', 
            NEW.id, 
            NEW.email;

  -- Only proceed if this is a Google user
  IF (NEW.raw_app_meta_data->>'provider' = 'google') THEN
    -- Enhanced email handling: use TRIM to remove whitespace and check for null
    IF NEW.email IS NULL OR TRIM(COALESCE(NEW.email, '')) = '' THEN
      user_email := 'user_' || NEW.id || '@placeholder.com';
      RAISE LOG 'Google user has no valid email, using placeholder: %', user_email;
    ELSE
      user_email := TRIM(NEW.email);
      RAISE LOG 'Using trimmed Google user email: %', user_email;
    END IF;

    -- Create or update profile with comprehensive error handling
    BEGIN
      -- Robust profile creation/update with explicit column qualification
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
        user_email, -- Using our validated email
        COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'customer', -- Default role
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email, -- Use the validated email from INSERT
        full_name = COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), public.profiles.full_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', public.profiles.avatar_url),
        updated_at = NOW();
        
      RAISE LOG 'Google profile created or updated for user %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      -- Log error but continue (don't fail the entire trigger)
      RAISE LOG 'Error syncing Google profile for user %: %, email: %', NEW.id, SQLERRM, user_email;
    END;

    -- Ensure the user has a role
    BEGIN
      INSERT INTO public.user_roles (
        user_id,
        role,
        is_approved,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        'customer', -- Default role
        TRUE,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        role = CASE WHEN public.user_roles.role = 'customer' THEN 'customer' ELSE public.user_roles.role END,
        updated_at = NOW();
        
      RAISE LOG 'User role created or updated for Google user %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error creating user role for Google user %: %', NEW.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

------------------------------------------------------------------
-- USER CREATION FUNCTION
------------------------------------------------------------------

-- Comprehensive function to handle all user creation aspects
CREATE OR REPLACE FUNCTION handle_user_creation()
RETURNS TRIGGER AS $$
DECLARE
  default_role text := 'customer';
  user_email text;
BEGIN
  -- Enhanced email handling
  IF NEW.email IS NULL OR TRIM(COALESCE(NEW.email, '')) = '' THEN
    user_email := 'user_' || NEW.id || '@placeholder.com';
    RAISE LOG 'New user has no valid email, using placeholder: %', user_email;
  ELSE
    user_email := TRIM(NEW.email);
    RAISE LOG 'Using trimmed user email for new user: %', user_email;
  END IF;

  -- Create profile with robust error handling
  BEGIN
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
      user_email, -- Using validated email
      COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      default_role,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email, -- Use validated email from INSERT
      full_name = COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), public.profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', public.profiles.avatar_url),
      updated_at = NOW();
      
    RAISE LOG 'Profile created or updated for new user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for new user %: %, email: %', NEW.id, SQLERRM, user_email;
  END;

  -- Create user role with robust error handling
  BEGIN
    INSERT INTO public.user_roles (
      user_id,
      role,
      is_approved,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      default_role,
      TRUE,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      role = CASE WHEN public.user_roles.role = 'customer' THEN default_role ELSE public.user_roles.role END,
      updated_at = NOW();
      
    RAISE LOG 'Role created or updated for new user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating user role for new user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

------------------------------------------------------------------
-- EMERGENCY RECOVERY FUNCTIONS
------------------------------------------------------------------

-- Function to directly create a profile with all validation bypassed
CREATE OR REPLACE FUNCTION emergency_create_profile(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_email text;
  success boolean := false;
BEGIN
  -- Get email from auth.users
  SELECT auth.users.email INTO user_email FROM auth.users WHERE auth.users.id = user_id_param;
  
  -- Force a valid email no matter what
  IF user_email IS NULL OR TRIM(COALESCE(user_email, '')) = '' THEN
    user_email := 'user_' || user_id_param || '@placeholder.com';
  END IF;
  
  -- Direct insert using explicit service_role execution
  BEGIN
    -- Delete any existing profile first (clean slate approach)
    DELETE FROM public.profiles WHERE id = user_id_param;
    
    -- Insert fresh profile
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
      user_id_param, 
      user_email,
      '',
      '',
      'customer',
      NOW(),
      NOW()
    );
    
    success := true;
    RAISE LOG 'Emergency profile creation successful for user %', user_id_param;
  EXCEPTION WHEN OTHERS THEN
    success := false;
    RAISE LOG 'Emergency profile creation failed for user %: %', user_id_param, SQLERRM;
  END;
  
  -- Also ensure user role exists
  IF success THEN
    BEGIN
      -- Delete any existing role first
      DELETE FROM public.user_roles WHERE user_id = user_id_param;
      
      -- Insert fresh role
      INSERT INTO public.user_roles (
        user_id,
        role,
        is_approved,
        created_at,
        updated_at
      )
      VALUES (
        user_id_param,
        'customer',
        TRUE,
        NOW(),
        NOW()
      );
      
      RAISE LOG 'Emergency role creation successful for user %', user_id_param;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Emergency role creation failed for user %: %', user_id_param, SQLERRM;
      -- Don't fail the entire operation if just the role fails
    END;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to fix users with missing emails
CREATE OR REPLACE FUNCTION fix_user_with_missing_email(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  placeholder_email text;
  profile_updated boolean := false;
  rows_affected integer;
BEGIN
  -- Generate a placeholder email
  placeholder_email := 'user_' || user_id_param || '@placeholder.com';
  
  RAISE LOG 'fix_user_with_missing_email called for user % with placeholder %', user_id_param, placeholder_email;
  
  -- Update the profile with the placeholder email using qualified column names
  UPDATE public.profiles 
  SET email = placeholder_email
  WHERE public.profiles.id = user_id_param 
  AND (public.profiles.email IS NULL OR TRIM(public.profiles.email) = '');
  
  -- Get the number of rows affected
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  -- Set the return value based on rows affected
  IF rows_affected > 0 THEN
    profile_updated := true;
    RAISE LOG 'Updated % rows with placeholder email', rows_affected;
  ELSE
    profile_updated := false;
    RAISE LOG 'No rows updated with placeholder email';
  END IF;
  
  RETURN profile_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

------------------------------------------------------------------
-- DEBUGGING FUNCTIONS
------------------------------------------------------------------

-- Enhanced debug function for troubleshooting Google authentication
CREATE OR REPLACE FUNCTION debug_google_auth(user_id_param UUID)
RETURNS json AS $$
DECLARE
  result json;
  user_email text;
  profile_email text;
BEGIN
  -- Fetch the email directly for inspection with column qualification
  SELECT auth.users.email INTO user_email FROM auth.users WHERE auth.users.id = user_id_param;
  
  -- Fetch the profile email separately for comparison
  SELECT public.profiles.email INTO profile_email FROM public.profiles WHERE public.profiles.id = user_id_param;

  -- Build a comprehensive debug report
  SELECT json_build_object(
    'user_exists', EXISTS(SELECT 1 FROM auth.users WHERE auth.users.id = user_id_param),
    'email', user_email,
    'email_trimmed', CASE WHEN user_email IS NULL THEN NULL ELSE TRIM(user_email) END,
    'email_is_null', user_email IS NULL,
    'email_is_empty', COALESCE(TRIM(user_email), '') = '',
    'email_length', length(COALESCE(user_email, '')),
    'email_type', pg_typeof(user_email)::text,
    'profile_exists', EXISTS(SELECT 1 FROM public.profiles WHERE public.profiles.id = user_id_param),
    'profile_email', profile_email,
    'profile_email_is_null', profile_email IS NULL,
    'emails_match', user_email = profile_email,
    'role_exists', EXISTS(SELECT 1 FROM public.user_roles WHERE public.user_roles.user_id = user_id_param),
    'role_details', (SELECT row_to_json(r) FROM (SELECT role, is_approved FROM public.user_roles WHERE public.user_roles.user_id = user_id_param) r),
    'provider', (SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE auth.users.id = user_id_param),
    'has_profile_permission', has_table_privilege('authenticated', 'profiles', 'INSERT'),
    'has_role_permission', has_table_privilege('authenticated', 'user_roles', 'INSERT')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

------------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------------

-- Set up the Google authentication trigger
CREATE TRIGGER on_auth_user_google_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_app_meta_data->>'provider' = 'google')
  EXECUTE FUNCTION sync_google_user_metadata();

-- Set up the general user creation trigger for non-Google users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_app_meta_data->>'provider' IS NULL OR NEW.raw_app_meta_data->>'provider' != 'google')
  EXECUTE FUNCTION handle_user_creation();

------------------------------------------------------------------
-- PERMISSIONS
------------------------------------------------------------------

-- Grant direct auth schema access (needed for functions)
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Grant access to auth.users table for functions
GRANT SELECT ON auth.users TO service_role;
GRANT SELECT ON auth.users TO authenticated;

-- Create service-role specific policies for profile and user_role creation
-- This allows the service role to create profiles during authentication
CREATE POLICY "Service role can manage profiles"
  ON public.profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage user roles"
  ON public.user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON FUNCTION sync_google_user_metadata() IS 
'Syncs Google user metadata with profiles table and assigns default roles, with comprehensive error handling';

COMMENT ON FUNCTION handle_user_creation() IS 
'Creates profiles and roles for new users with robust error handling';

COMMENT ON FUNCTION emergency_create_profile(UUID) IS
'Emergency function to create a profile and role with validation bypassed, for auth recovery';

COMMENT ON FUNCTION fix_user_with_missing_email(UUID) IS
'Updates profiles with placeholder emails for users with NULL or empty emails';

COMMENT ON FUNCTION debug_google_auth(UUID) IS
'Advanced diagnostic function for Google authentication issues';
