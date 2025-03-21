------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 002_user_roles.sql
------------------------------------------------------------------
-- This migration creates the user role management system, including:
-- - user_roles table for role assignments
-- - user_role_requests for role change requests
-- - Triggers for synchronizing user data
-- - Basic policies for user role management
------------------------------------------------------------------

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------------
-- USER ROLE TABLES
------------------------------------------------------------------

-- Create user_roles table for role assignment
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'manager')),
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a user_role_requests table for role change requests
CREATE TABLE IF NOT EXISTS public.user_role_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('customer', 'employee', 'manager')),
  previous_role TEXT NOT NULL,  -- Changed from current_role to avoid reserved keyword
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------------

-- Create trigger to update the updated_at timestamp for user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create trigger for user_role_requests
CREATE TRIGGER update_user_role_requests_updated_at
BEFORE UPDATE ON public.user_role_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create a function to handle new user creation (adding default role)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a default customer role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');

  -- For non-Google users, also make sure they have a profile
  -- (Google users will get profiles through the Google sync function)
  IF (NEW.raw_app_meta_data->>'provider' != 'google') THEN
    INSERT INTO public.profiles (
      id, 
      email,
      role,
      created_at,
      updated_at
    ) 
    VALUES (
      NEW.id, 
      COALESCE(NEW.email, 'user_' || NEW.id || '@placeholder.com'),
      'customer',  
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a trigger to add roles for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Set up a trigger to keep the email in sync with auth.users
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from auth.users with fallback for null values
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Use a placeholder if email is null or empty
  IF user_email IS NULL OR TRIM(user_email) = '' THEN
    user_email := 'user_' || NEW.id || '@placeholder.com';
  END IF;
  
  NEW.email = user_email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to ensure email is always in sync with auth.users
CREATE TRIGGER before_profile_insert_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_email();

------------------------------------------------------------------
-- ROW LEVEL SECURITY
------------------------------------------------------------------

-- Enable RLS on tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_requests ENABLE ROW LEVEL SECURITY;

-- Basic policies for user_roles table
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- This is a development-friendly policy that allows users to change their own role
-- In production, this would be more restricted
CREATE POLICY "Users can update their own role (dev)" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own role (dev)" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for user_role_requests
CREATE POLICY "Users can view their own role requests" 
  ON public.user_role_requests 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own role requests" 
  ON public.user_role_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own role requests" 
  ON public.user_role_requests 
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own role requests" 
  ON public.user_role_requests 
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

------------------------------------------------------------------
-- Basic profile policies (non-role based)
------------------------------------------------------------------

-- Drop policies if they exist (will be replaced with security definer functions in next migration)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;

-- This policy allows users to see their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (id = auth.uid());

-- This policy allows users to update only their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (id = auth.uid());

-- This policy allows users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (id = auth.uid());

-- This policy allows users to delete their own profile
CREATE POLICY "Users can delete their own profile" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (id = auth.uid());

------------------------------------------------------------------
-- CLEANUP FROM PREVIOUS VERSIONS
------------------------------------------------------------------

-- Populate user_roles from existing profiles if needed
-- This is useful when migrating from a previous system or applying to existing data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = profiles.id
  )) THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, role FROM public.profiles
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = profiles.id
    );
  END IF;
END
$$;

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON TABLE public.user_roles IS 'User role assignments, used for access control';
COMMENT ON TABLE public.user_role_requests IS 'Requests for changes to user roles, requiring approval';

COMMENT ON FUNCTION handle_new_user() IS 'Creates default roles for new users';
COMMENT ON FUNCTION sync_profile_email() IS 'Ensures profile emails match auth.users email, with fallback for null values';
