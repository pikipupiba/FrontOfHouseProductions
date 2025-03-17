-- Initial database schema for Front of House Productions
-- This migration creates the core tables with row-level security policies

-- Enable UUID extension for uuid_generate_v4() function
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table that extends the auth.users table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'manager')),
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Managers can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Create equipment table
CREATE TABLE public.equipment (
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

-- Enable Row Level Security
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment
CREATE POLICY "Anyone can view equipment" 
  ON public.equipment 
  FOR SELECT 
  USING (TRUE);

CREATE POLICY "Only employees and managers can update equipment" 
  ON public.equipment 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
    )
  );

CREATE POLICY "Only managers can insert equipment" 
  ON public.equipment 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Create rentals table
CREATE TABLE public.rentals (
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

-- Enable Row Level Security
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Create policies for rentals
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

CREATE POLICY "Employees and managers can view all rentals" 
  ON public.rentals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
    )
  );

CREATE POLICY "Employees and managers can update any rental" 
  ON public.rentals 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
    )
  );

-- Create rental_items table
CREATE TABLE public.rental_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES public.equipment(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  daily_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;

-- Create policies for rental_items (similar to rentals)
CREATE POLICY "Customers can view their own rental items" 
  ON public.rental_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE id = rental_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Employees and managers can view all rental items" 
  ON public.rental_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
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

CREATE POLICY "Employees and managers can insert rental items" 
  ON public.rental_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
    )
  );

-- Create documents table for file uploads
CREATE TABLE public.documents (
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

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can view their own documents" 
  ON public.documents 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Employees and managers can view documents for rentals they manage" 
  ON public.documents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'employee' OR role = 'manager')
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
