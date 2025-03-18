------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 001_core_schema.sql
------------------------------------------------------------------
-- This migration creates the core database schema for Front of House Productions
-- including base tables, triggers, and basic RLS policies.
------------------------------------------------------------------

-- Enable UUID extension for uuid_generate_v4() function
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------------
-- CORE TABLES
------------------------------------------------------------------

-- Create user profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'manager')),
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  rfid_tag TEXT UNIQUE,
  condition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create rental_items table
CREATE TABLE IF NOT EXISTS public.rental_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES public.equipment(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  daily_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create documents table for file uploads
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  rental_id UUID REFERENCES public.rentals(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'stage_plot', 'photo', 'video', 'venue_spec', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------------
-- UTILITY FUNCTIONS
------------------------------------------------------------------

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Utility function to get JWT user ID (used in policies)
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL STABLE;

------------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------------

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rentals_updated_at
BEFORE UPDATE ON public.rentals
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rental_items_updated_at
BEFORE UPDATE ON public.rental_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

------------------------------------------------------------------
-- BASE RLS POLICIES (USER OWNED RESOURCES)
------------------------------------------------------------------

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Basic policies for viewing public data and user's own data
-- (Role-based policies will be defined in the security_functions migration)

-- EQUIPMENT - anyone can view equipment
CREATE POLICY "Anyone can view equipment" 
  ON public.equipment 
  FOR SELECT 
  USING (TRUE);

-- RENTALS - customers can view, insert and update their own rentals
CREATE POLICY "Customers can view their own rentals" 
  ON public.rentals 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert their own rentals" 
  ON public.rentals 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own rentals" 
  ON public.rentals 
  FOR UPDATE 
  USING (
    auth.uid() = customer_id AND status = 'pending'
  );

-- RENTAL ITEMS - customers can view and insert items for their own rentals
CREATE POLICY "Customers can view their own rental items" 
  ON public.rental_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE id = rental_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Customers can insert their own rental items" 
  ON public.rental_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE id = rental_id AND customer_id = auth.uid() AND status = 'pending'
    )
  );

-- DOCUMENTS - users can view, insert their own documents
CREATE POLICY "Users can view their own documents" 
  ON public.documents 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';
COMMENT ON TABLE public.equipment IS 'Equipment inventory available for rental';
COMMENT ON TABLE public.rentals IS 'Customer equipment rental records';
COMMENT ON TABLE public.rental_items IS 'Items included in each rental';
COMMENT ON TABLE public.documents IS 'Files uploaded by users, such as contracts or event specs';

COMMENT ON FUNCTION update_updated_at() IS 'Trigger function to automatically update the updated_at timestamp';
COMMENT ON FUNCTION get_auth_uid() IS 'Helper function to get the current authenticated user ID';
