------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 003_security_functions.sql
------------------------------------------------------------------
-- This migration creates security definer functions for role-based access
-- and updates all RLS policies to use these functions to avoid infinite recursion.
------------------------------------------------------------------

------------------------------------------------------------------
-- SECURITY DEFINER FUNCTIONS
------------------------------------------------------------------

-- Create a function to check if a user is a manager (bypasses RLS)
CREATE OR REPLACE FUNCTION is_manager(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_id_param AND role = 'manager' AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to check if a user is an employee (bypasses RLS)
CREATE OR REPLACE FUNCTION is_employee(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_id_param AND role = 'employee' AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to check if a user has a specific role (bypasses RLS)
CREATE OR REPLACE FUNCTION has_role(user_id_param UUID, role_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_id_param AND role = role_param AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to get a user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.user_roles
  WHERE user_id = user_id_param AND is_approved = true
  LIMIT 1;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

------------------------------------------------------------------
-- UPDATE PROFILES POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can delete profiles" ON public.profiles;

-- Create role-based policies using security definer functions
CREATE POLICY "Managers can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (is_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE USER_ROLES POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Managers can update any role" ON public.user_roles;
DROP POLICY IF EXISTS "Managers can delete user roles" ON public.user_roles;

-- Create role-based policies using security definer functions
CREATE POLICY "Managers can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can update any role" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can delete user roles" 
  ON public.user_roles 
  FOR DELETE 
  TO authenticated
  USING (is_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE EQUIPMENT POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Only employees and managers can update equipment" ON public.equipment;
DROP POLICY IF EXISTS "Only managers can insert equipment" ON public.equipment;

-- Create role-based policies using security definer functions
CREATE POLICY "Only employees and managers can update equipment" 
  ON public.equipment 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Only managers can insert equipment" 
  ON public.equipment 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_manager(auth.uid()));

CREATE POLICY "Only managers can delete equipment" 
  ON public.equipment 
  FOR DELETE 
  TO authenticated
  USING (is_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE RENTALS POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Employees and managers can view all rentals" ON public.rentals;
DROP POLICY IF EXISTS "Employees and managers can update any rental" ON public.rentals;

-- Create role-based policies using security definer functions
CREATE POLICY "Employees and managers can view all rentals" 
  ON public.rentals 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can update any rental" 
  ON public.rentals 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can insert rentals" 
  ON public.rentals 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can delete rentals" 
  ON public.rentals 
  FOR DELETE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE RENTAL_ITEMS POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Employees and managers can view all rental items" ON public.rental_items;
DROP POLICY IF EXISTS "Employees and managers can insert rental items" ON public.rental_items;

-- Create role-based policies using security definer functions
CREATE POLICY "Employees and managers can view all rental items" 
  ON public.rental_items 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can insert rental items" 
  ON public.rental_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can update rental items" 
  ON public.rental_items 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can delete rental items" 
  ON public.rental_items 
  FOR DELETE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE DOCUMENTS POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Employees and managers can view documents for rentals they manage" ON public.documents;

-- Create role-based policies using security definer functions
CREATE POLICY "Employees and managers can view all documents" 
  ON public.documents 
  FOR SELECT 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can insert documents" 
  ON public.documents 
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can update documents" 
  ON public.documents 
  FOR UPDATE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

CREATE POLICY "Employees and managers can delete documents" 
  ON public.documents 
  FOR DELETE 
  TO authenticated
  USING (is_employee_or_manager(auth.uid()));

------------------------------------------------------------------
-- UPDATE USER_ROLE_REQUESTS POLICIES
------------------------------------------------------------------

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can view all role requests" ON public.user_role_requests;
DROP POLICY IF EXISTS "Managers can update role requests" ON public.user_role_requests;
DROP POLICY IF EXISTS "Managers can delete role requests" ON public.user_role_requests;

-- Create role-based policies using security definer functions
CREATE POLICY "Managers can view all role requests" 
  ON public.user_role_requests 
  FOR SELECT 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can update role requests" 
  ON public.user_role_requests 
  FOR UPDATE 
  TO authenticated
  USING (is_manager(auth.uid()));

CREATE POLICY "Managers can delete role requests" 
  ON public.user_role_requests 
  FOR DELETE 
  TO authenticated
  USING (is_manager(auth.uid()));

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON FUNCTION is_manager(UUID) IS 'Security definer function to check if a user is a manager';
COMMENT ON FUNCTION is_employee(UUID) IS 'Security definer function to check if a user is an employee';
COMMENT ON FUNCTION is_employee_or_manager(UUID) IS 'Security definer function to check if a user is an employee or manager';
COMMENT ON FUNCTION has_role(UUID, TEXT) IS 'Security definer function to check if a user has a specific role';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Security definer function to get a user''s role';
