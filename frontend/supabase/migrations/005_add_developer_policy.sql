-- Migration to add a development policy for role management testing
-- This policy allows users to set their own role to any value for development purposes

-- First, drop the policy that restricts users to only update their role if it's 'customer'
DROP POLICY IF EXISTS "Users can update their own customer role" ON public.user_roles;

-- Create a more permissive policy for development that allows users to change their own role
CREATE POLICY "Users can update their own role (dev)" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Note: In production, you would want to restrict this to only allow
-- customer role updates or require manager approval for other roles.
-- This policy is intentionally permissive for development purposes.

-- Also add an INSERT policy to allow users to create their own roles
-- This handles the case where a user record might not exist yet
CREATE POLICY "Users can insert their own role (dev)" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
