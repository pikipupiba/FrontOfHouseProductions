-- Migration to fix the infinite recursion in user_roles table policies
-- This creates a security definer function to bypass RLS during role checks

-- Create a function to check if a user is a manager (bypasses RLS)
CREATE OR REPLACE FUNCTION is_manager(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_id_param AND role = 'manager' AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user is an employee or manager (bypasses RLS)
CREATE OR REPLACE FUNCTION is_employee_or_manager(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_id_param AND 
          (role = 'employee' OR role = 'manager') AND 
          is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate policies for user_roles table
DROP POLICY IF EXISTS "Managers can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Managers can update any role" ON public.user_roles;
DROP POLICY IF EXISTS "Managers can delete user roles" ON public.user_roles;

CREATE POLICY "Managers can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can update any role" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can delete user roles" 
  ON public.user_roles 
  FOR DELETE 
  TO authenticated
  USING (is_manager((select auth.uid())));

-- Fix profiles table policies to use the new functions
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can delete profiles" ON public.profiles;

CREATE POLICY "Managers can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (is_manager((select auth.uid())));

-- Fix equipment table policies
DROP POLICY IF EXISTS "Only employees and managers can update equipment" ON public.equipment;
DROP POLICY IF EXISTS "Only managers can insert equipment" ON public.equipment;

CREATE POLICY "Only employees and managers can update equipment" 
  ON public.equipment 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager((select auth.uid())));

CREATE POLICY "Only managers can insert equipment" 
  ON public.equipment 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_manager((select auth.uid())));

-- Fix rentals table policies
DROP POLICY IF EXISTS "Employees and managers can view all rentals" ON public.rentals;
DROP POLICY IF EXISTS "Employees and managers can update any rental" ON public.rentals;

CREATE POLICY "Employees and managers can view all rentals" 
  ON public.rentals 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager((select auth.uid())));

CREATE POLICY "Employees and managers can update any rental" 
  ON public.rentals 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager((select auth.uid())));

-- Fix rental_items table policies
DROP POLICY IF EXISTS "Employees and managers can view all rental items" ON public.rental_items;
DROP POLICY IF EXISTS "Employees and managers can insert rental items" ON public.rental_items;

CREATE POLICY "Employees and managers can view all rental items" 
  ON public.rental_items 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager((select auth.uid())));

CREATE POLICY "Employees and managers can insert rental items" 
  ON public.rental_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_employee_or_manager((select auth.uid())));

-- Fix documents table policies
DROP POLICY IF EXISTS "Employees and managers can view documents for rentals they manage" ON public.documents;

CREATE POLICY "Employees and managers can view documents for rentals they manage" 
  ON public.documents 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager((select auth.uid())));

-- Fix user_role_requests table policies
DROP POLICY IF EXISTS "Managers can view all role requests" ON public.user_role_requests;
DROP POLICY IF EXISTS "Managers can update role requests" ON public.user_role_requests;
DROP POLICY IF EXISTS "Managers can delete role requests" ON public.user_role_requests;

CREATE POLICY "Managers can view all role requests" 
  ON public.user_role_requests 
  FOR SELECT 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can update role requests" 
  ON public.user_role_requests 
  FOR UPDATE 
  TO authenticated
  USING (is_manager((select auth.uid())));

CREATE POLICY "Managers can delete role requests" 
  ON public.user_role_requests 
  FOR DELETE 
  TO authenticated
  USING (is_manager((select auth.uid())));
