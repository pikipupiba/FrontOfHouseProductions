-- Migration to fix the infinite recursion in the profiles table RLS policies
-- This migration ensures the profiles table doesn't reference itself for permissions

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, drop the problematic policies on the profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;

-- Re-create the necessary policies without circular dependencies
-- This policy allows users to see their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (id = (select auth.uid()));

-- This policy allows users to update only their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (id = (select auth.uid()));

-- This policy allows managers to view all profiles, but references the user_roles table
CREATE POLICY "Managers can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager' AND is_approved = true
    )
  );

-- Add policy to allow managers to update all profiles
CREATE POLICY "Managers can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager' AND is_approved = true
    )
  );

-- Policy for user profile insertion is already created in migration 002
-- CREATE POLICY "Users can insert their own profile" 
--   ON public.profiles 
--   FOR INSERT 
--   TO authenticated
--   WITH CHECK (id = (select auth.uid()));

-- Explicitly add delete policy for profiles
CREATE POLICY "Users can delete their own profile" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (id = (select auth.uid()));

-- Add managers can delete policy
CREATE POLICY "Managers can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager' AND is_approved = true
    )
  );

-- Remove the role field from profiles table (optional - can be done later if desired)
-- For now, we'll keep it for backward compatibility but not use it for permissions
-- ALTER TABLE public.profiles DROP COLUMN role;

-- Set up a trigger to keep the email in sync with auth.users
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = (SELECT email FROM auth.users WHERE id = NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure email is always in sync with auth.users
CREATE TRIGGER before_profile_insert_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_email();
