-- Migration 013: Fix SQL Function Errors
-- This fixes specific errors in the previously created SQL functions:
-- 1. Ambiguous column references
-- 2. Email NULL handling
-- 3. Type comparison errors

-- Fix ensure_user_has_profile_and_role function to properly qualify ambiguous columns
CREATE OR REPLACE FUNCTION ensure_user_has_profile_and_role(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  has_profile boolean;
  has_role boolean;
  default_role text := 'customer';
  user_email text;
BEGIN
  -- Add specific debugging for the incoming parameters
  RAISE LOG 'ensure_user_has_profile_and_role called with user_uuid: %', user_uuid;
  
  -- Get user's email from auth.users with robust handling - explicitly qualify all columns
  SELECT auth.users.email INTO user_email FROM auth.users WHERE auth.users.id = user_uuid;
  
  -- Log the email value retrieved directly from auth.users
  RAISE LOG 'User email directly from auth.users: %, type: %', 
            user_email, 
            pg_typeof(user_email)::text;
  
  -- Email validation - use placeholder if needed
  IF user_email IS NULL OR TRIM(user_email) = '' THEN
    user_email := 'user_' || user_uuid || '@placeholder.com';
    RAISE LOG 'Using placeholder email: %', user_email;
  ELSE
    -- Ensure email is properly trimmed and not just whitespace
    user_email := TRIM(user_email);
    RAISE LOG 'Using trimmed email: %', user_email;
  END IF;
  
  -- Check if user has profile - explicitly qualify the id column
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE public.profiles.id = user_uuid
  ) INTO has_profile;
  
  RAISE LOG 'User has profile: %', has_profile;
  
  -- Create profile if needed with validated email
  IF NOT has_profile THEN
    BEGIN
      -- Insert with explicit column qualification
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
        user_uuid, 
        COALESCE(user_email, 'user_' || user_uuid || '@placeholder.com'), -- Double safety with COALESCE
        '', -- Full name can be updated later
        '', -- Avatar URL can be updated later
        default_role,
        NOW(),
        NOW()
      );
      has_profile := true;
      RAISE LOG 'Created profile for user % with email %', user_uuid, user_email;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error in ensure_user_has_profile_and_role creating profile: %, email: %', SQLERRM, user_email;
      RETURN false;
    END;
  END IF;
  
  -- User role handling (unchanged but with explicit column qualification)
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE public.user_roles.user_id = user_uuid
  ) INTO has_role;
  
  RAISE LOG 'User has role: %', has_role;
  
  IF NOT has_role THEN
    BEGIN
      INSERT INTO public.user_roles (
        user_id,
        role,
        is_approved,
        created_at,
        updated_at
      )
      VALUES (
        user_uuid,
        default_role,
        TRUE,
        NOW(),
        NOW()
      );
      has_role := true;
      RAISE LOG 'Created role for user %', user_uuid;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error in ensure_user_has_profile_and_role creating role: %', SQLERRM;
      RETURN false;
    END;
  END IF;
  
  RETURN has_profile AND has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix handle_user_creation function to properly handle email and qualify columns
CREATE OR REPLACE FUNCTION handle_user_creation()
RETURNS TRIGGER AS $$
DECLARE
  default_role text := 'customer';
  user_email text;
BEGIN
  -- Log raw email value from auth.users
  RAISE LOG 'handle_user_creation triggered for user % with email %', 
            NEW.id, 
            NEW.email;
            
  -- Enhanced email handling: use TRIM to remove whitespace and check more conditions
  IF NEW.email IS NULL OR TRIM(COALESCE(NEW.email, '')) = '' THEN
    user_email := 'user_' || NEW.id || '@placeholder.com';
    RAISE LOG 'User has no valid email, using placeholder: %', user_email;
  ELSE
    user_email := TRIM(NEW.email);
    RAISE LOG 'Using trimmed user email: %', user_email;
  END IF;

  -- Wrap profile creation in exception handling
  BEGIN
    -- Create profile if it doesn't exist with robust email handling
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
      default_role,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email, -- Use the specific column from the INSERT values
      full_name = COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), public.profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', public.profiles.avatar_url),
      updated_at = NOW();
      
    RAISE LOG 'Profile created or updated for user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue (don't fail the entire trigger)
    RAISE LOG 'Error creating profile for user %: %, email: %', NEW.id, SQLERRM, user_email;
  END;

  -- Role creation with better error handling and explicit column qualification
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
      
    RAISE LOG 'Role created or updated for user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating user role for user %: %', NEW.id, SQLERRM;
  END;

  -- Always return NEW to ensure the original operation completes
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix the fix_user_with_missing_email function to correctly handle type comparison
CREATE OR REPLACE FUNCTION fix_user_with_missing_email(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  placeholder_email text;
  profile_updated boolean := false;
  rows_affected integer;
BEGIN
  -- Generate a placeholder email
  placeholder_email := 'user_' || user_uuid || '@placeholder.com';
  
  RAISE LOG 'fix_user_with_missing_email called for user % with placeholder %', user_uuid, placeholder_email;
  
  -- Update the profile with the placeholder email using qualified column names
  UPDATE public.profiles 
  SET email = placeholder_email
  WHERE public.profiles.id = user_uuid 
  AND (public.profiles.email IS NULL OR TRIM(public.profiles.email) = '');
  
  -- Get the number of rows affected
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  -- Set the return value based on rows affected (avoiding boolean > integer comparison)
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

-- Fix the debug_google_auth function to provide more detailed diagnostics
CREATE OR REPLACE FUNCTION debug_google_auth(user_uuid uuid)
RETURNS json AS $$
DECLARE
  result json;
  user_email text;
  profile_email text;
BEGIN
  -- Fetch the email directly for inspection with column qualification
  SELECT auth.users.email INTO user_email FROM auth.users WHERE auth.users.id = user_uuid;
  
  -- Fetch the profile email separately for comparison
  SELECT public.profiles.email INTO profile_email FROM public.profiles WHERE public.profiles.id = user_uuid;

  -- Build a comprehensive debug report
  SELECT json_build_object(
    'user_exists', EXISTS(SELECT 1 FROM auth.users WHERE auth.users.id = user_uuid),
    'email', user_email,
    'email_trimmed', CASE WHEN user_email IS NULL THEN NULL ELSE TRIM(user_email) END,
    'email_is_null', user_email IS NULL,
    'email_is_empty', COALESCE(TRIM(user_email), '') = '',
    'email_length', length(COALESCE(user_email, '')),
    'email_type', pg_typeof(user_email)::text,
    'profile_exists', EXISTS(SELECT 1 FROM public.profiles WHERE public.profiles.id = user_uuid),
    'profile_email', profile_email,
    'profile_email_is_null', profile_email IS NULL,
    'emails_match', user_email = profile_email,
    'role_exists', EXISTS(SELECT 1 FROM public.user_roles WHERE public.user_roles.user_id = user_uuid),
    'role_details', (SELECT row_to_json(r) FROM (SELECT role, is_approved FROM public.user_roles WHERE public.user_roles.user_id = user_uuid) r),
    'provider', (SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE auth.users.id = user_uuid),
    'has_profile_permission', has_table_privilege('authenticated', 'profiles', 'INSERT'),
    'has_role_permission', has_table_privilege('authenticated', 'user_roles', 'INSERT')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a direct insert function for emergencies that bypasses all checks
CREATE OR REPLACE FUNCTION emergency_create_profile(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  user_email text;
  success boolean := false;
BEGIN
  -- Get email from auth.users
  SELECT auth.users.email INTO user_email FROM auth.users WHERE auth.users.id = user_uuid;
  
  -- Force a valid email no matter what
  IF user_email IS NULL OR TRIM(COALESCE(user_email, '')) = '' THEN
    user_email := 'user_' || user_uuid || '@placeholder.com';
  END IF;
  
  -- Direct insert using explicit service_role execution
  BEGIN
    -- Delete any existing profile first (clean slate approach)
    DELETE FROM public.profiles WHERE id = user_uuid;
    
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
      user_uuid, 
      user_email,
      '',
      '',
      'customer',
      NOW(),
      NOW()
    );
    
    success := true;
    RAISE LOG 'Emergency profile creation successful for user %', user_uuid;
  EXCEPTION WHEN OTHERS THEN
    success := false;
    RAISE LOG 'Emergency profile creation failed for user %: %', user_uuid, SQLERRM;
  END;
  
  -- Also ensure user role exists
  IF success THEN
    BEGIN
      -- Delete any existing role first
      DELETE FROM public.user_roles WHERE user_id = user_uuid;
      
      -- Insert fresh role
      INSERT INTO public.user_roles (
        user_id,
        role,
        is_approved,
        created_at,
        updated_at
      )
      VALUES (
        user_uuid,
        'customer',
        TRUE,
        NOW(),
        NOW()
      );
      
      RAISE LOG 'Emergency role creation successful for user %', user_uuid;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Emergency role creation failed for user %: %', user_uuid, SQLERRM;
      -- Don't fail the entire operation if just the role fails
    END;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Comment to explain what this migration is doing
COMMENT ON FUNCTION ensure_user_has_profile_and_role(uuid) IS 
'Fixed function that properly qualifies all column references and handles email validation';

COMMENT ON FUNCTION handle_user_creation() IS 
'Fixed function with better email validation and qualified column references';

COMMENT ON FUNCTION fix_user_with_missing_email(uuid) IS
'Fixed function that corrects the boolean/integer comparison error';

COMMENT ON FUNCTION debug_google_auth(uuid) IS
'Enhanced debugging function with more detailed email diagnostics';

COMMENT ON FUNCTION emergency_create_profile(uuid) IS
'Emergency function to create a profile and role with all validation bypassed';
