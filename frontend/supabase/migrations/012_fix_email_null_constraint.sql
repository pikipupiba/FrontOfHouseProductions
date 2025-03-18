-- Migration 012: Fix Email Null Constraint Issues in Auth
-- This migration addresses the "null value in column email violates not-null constraint" error

-- First, let's update the handle_user_creation function to better handle email values
CREATE OR REPLACE FUNCTION handle_user_creation()
RETURNS TRIGGER AS $$
DECLARE
  default_role text := 'customer';
  user_email text;
BEGIN
  -- Ensure we have a valid email - this is critical
  -- If email is NULL from auth.users, use a placeholder with user ID to satisfy constraint
  IF NEW.email IS NULL OR NEW.email = '' THEN
    user_email := 'user_' || NEW.id || '@placeholder.com';
    RAISE LOG 'User has no email, using placeholder: %', user_email;
  ELSE
    user_email := NEW.email;
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
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      default_role,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = user_email, -- Always update with validated email
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue (don't fail the entire trigger)
    RAISE LOG 'Error creating profile for user %: %, email: %', NEW.id, SQLERRM, user_email;
  END;

  -- Role creation unchanged from previous version
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
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating user role for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the ensure_user_has_profile_and_role function to handle email better
CREATE OR REPLACE FUNCTION ensure_user_has_profile_and_role(user_id uuid)
RETURNS boolean AS $$
DECLARE
  has_profile boolean;
  has_role boolean;
  default_role text := 'customer';
  user_email text;
BEGIN
  -- Get user's email from auth.users with robust handling
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  -- Email validation - use placeholder if needed
  IF user_email IS NULL OR user_email = '' THEN
    user_email := 'user_' || user_id || '@placeholder.com';
    RAISE LOG 'User % has no email in ensure_user_has_profile_and_role, using placeholder', user_id;
  END IF;
  
  -- Check if user has profile
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) INTO has_profile;
  
  -- Create profile if needed with validated email
  IF NOT has_profile THEN
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
        user_id, 
        user_email, -- Using validated email
        '', -- Full name can be updated later
        '', -- Avatar URL can be updated later
        default_role,
        NOW(),
        NOW()
      );
      has_profile := true;
      RAISE LOG 'Created profile for user % with email %', user_id, user_email;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error in ensure_user_has_profile_and_role creating profile: %, email: %', SQLERRM, user_email;
      RETURN false;
    END;
  END IF;
  
  -- User role handling (unchanged)
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_id) INTO has_role;
  
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
        user_id,
        default_role,
        TRUE,
        NOW(),
        NOW()
      );
      has_role := true;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error in ensure_user_has_profile_and_role creating role: %', SQLERRM;
      RETURN false;
    END;
  END IF;
  
  RETURN has_profile AND has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enhance the debug function to include more email details
CREATE OR REPLACE FUNCTION debug_google_auth(user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
  user_email text;
BEGIN
  -- Fetch the email directly for inspection
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;

  SELECT json_build_object(
    'user_exists', EXISTS(SELECT 1 FROM auth.users WHERE id = user_id),
    'email', user_email,
    'email_is_null', user_email IS NULL,
    'email_is_empty', user_email = '',
    'email_length', length(user_email),
    'profile_exists', EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id),
    'profile_email', (SELECT email FROM public.profiles WHERE id = user_id),
    'role_exists', EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = user_id),
    'provider', (SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE id = user_id),
    'has_profile_permission', has_table_privilege('authenticated', 'profiles', 'INSERT'),
    'has_role_permission', has_table_privilege('authenticated', 'user_roles', 'INSERT')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a specific function to fix users with missing emails
CREATE OR REPLACE FUNCTION fix_user_with_missing_email(user_id uuid)
RETURNS boolean AS $$
DECLARE
  placeholder_email text;
  profile_updated boolean := false;
BEGIN
  -- Generate a placeholder email
  placeholder_email := 'user_' || user_id || '@placeholder.com';
  
  -- Update the profile with the placeholder email
  UPDATE public.profiles 
  SET email = placeholder_email
  WHERE id = user_id AND (email IS NULL OR email = '');
  
  GET DIAGNOSTICS profile_updated = ROW_COUNT;
  
  RETURN profile_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment to explain what this migration is doing
COMMENT ON FUNCTION handle_user_creation() IS 
'Updated function to handle null or empty emails by using a placeholder';

COMMENT ON FUNCTION ensure_user_has_profile_and_role(uuid) IS
'Updated function that validates and uses placeholder emails when needed';

COMMENT ON FUNCTION debug_google_auth(uuid) IS
'Enhanced debugging function with detailed email inspection';

COMMENT ON FUNCTION fix_user_with_missing_email(uuid) IS
'Utility function to fix users with missing emails by setting a placeholder';
