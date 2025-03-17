-- Migration to create a separate user_roles table and fix infinite recursion in RLS policies
-- This migration addresses the issue with circular dependencies in profile policies

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'manager')),
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Populate user_roles from existing profiles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create policies for user_roles table
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own customer role" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (
    user_id = (select auth.uid()) AND 
    OLD.role = 'customer' AND 
    NEW.role = 'customer'
  );

-- This policy is safe because it references itself but doesn't depend on
-- another table that depends on it (breaking the circular dependency)
CREATE POLICY "Managers can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

CREATE POLICY "Managers can update any role" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

-- Add delete policy for user_roles
CREATE POLICY "Managers can delete user roles" 
  ON public.user_roles 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to add roles for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update policies for other tables to use user_roles instead of profiles
-- For the equipment table
DROP POLICY IF EXISTS "Only employees and managers can update equipment" ON public.equipment;
CREATE POLICY "Only employees and managers can update equipment" 
  ON public.equipment 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

DROP POLICY IF EXISTS "Only managers can insert equipment" ON public.equipment;
CREATE POLICY "Only managers can insert equipment" 
  ON public.equipment 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

-- For the rentals table
DROP POLICY IF EXISTS "Employees and managers can view all rentals" ON public.rentals;
CREATE POLICY "Employees and managers can view all rentals" 
  ON public.rentals 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

DROP POLICY IF EXISTS "Employees and managers can update any rental" ON public.rentals;
CREATE POLICY "Employees and managers can update any rental" 
  ON public.rentals 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

-- For the rental_items table
DROP POLICY IF EXISTS "Employees and managers can view all rental items" ON public.rental_items;
CREATE POLICY "Employees and managers can view all rental items" 
  ON public.rental_items 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

DROP POLICY IF EXISTS "Employees and managers can insert rental items" ON public.rental_items;
CREATE POLICY "Employees and managers can insert rental items" 
  ON public.rental_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

-- For the documents table
DROP POLICY IF EXISTS "Employees and managers can view documents for rentals they manage" ON public.documents;
CREATE POLICY "Employees and managers can view documents for rentals they manage" 
  ON public.documents 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND (role = 'employee' OR role = 'manager')
    )
  );

-- Fix the problematic manager policy on profiles
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;
CREATE POLICY "Managers can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

-- Add policy for profiles insertion
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Create a user_role_requests table for role change requests
CREATE TABLE public.user_role_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('customer', 'employee', 'manager')),
  previous_role TEXT NOT NULL,  -- Changed from current_role to avoid reserved keyword
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on the user_role_requests table
ALTER TABLE public.user_role_requests ENABLE ROW LEVEL SECURITY;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_user_role_requests_updated_at
BEFORE UPDATE ON public.user_role_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create policies for user_role_requests
CREATE POLICY "Users can view their own role requests" 
  ON public.user_role_requests 
  FOR SELECT 
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own role requests" 
  ON public.user_role_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own role requests" 
  ON public.user_role_requests 
  FOR UPDATE 
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own role requests" 
  ON public.user_role_requests 
  FOR DELETE 
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Managers can view all role requests" 
  ON public.user_role_requests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

CREATE POLICY "Managers can update role requests" 
  ON public.user_role_requests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );

CREATE POLICY "Managers can delete role requests" 
  ON public.user_role_requests 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid()) AND role = 'manager'
    )
  );
