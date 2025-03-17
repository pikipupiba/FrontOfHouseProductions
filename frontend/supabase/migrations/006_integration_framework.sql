-- Migration for integration framework tables
-- Adds tables for credentials storage and cache metadata

-- Create schema for integration cache if it doesn't exist
CREATE SCHEMA IF NOT EXISTS integration_cache;

-- Create integration credentials table
-- For storing encrypted API credentials
CREATE TABLE IF NOT EXISTS public.integration_credentials (
  service_name TEXT PRIMARY KEY,
  credentials TEXT NOT NULL, -- Encrypted JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cache metadata table to track sync status
CREATE TABLE IF NOT EXISTS integration_cache.metadata (
  service_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  last_full_sync TIMESTAMP WITH TIME ZONE,
  last_incremental_sync TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1,
  sync_status TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (service_name, resource_type)
);

-- Setup RLS policies

-- Only allow server-side access to credentials (for security)
ALTER TABLE public.integration_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Credentials accessible only by service role" 
  ON public.integration_credentials
  USING (false);

-- Read-only access to cache metadata for authenticated users
ALTER TABLE integration_cache.metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Metadata viewable by authenticated users" 
  ON integration_cache.metadata
  FOR SELECT
  TO authenticated
  USING (true);

-- Utility function to get JWT user ID
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE SQL STABLE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_metadata_service
  ON integration_cache.metadata(service_name);

CREATE INDEX IF NOT EXISTS idx_integration_metadata_last_sync
  ON integration_cache.metadata(last_incremental_sync);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for integration_credentials
CREATE TRIGGER update_integration_credentials_updated_at
  BEFORE UPDATE ON public.integration_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for metadata
CREATE TRIGGER update_integration_metadata_updated_at
  BEFORE UPDATE ON integration_cache.metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Example cache table for Current RMS
-- Can be removed if not needed or customized for different services
CREATE TABLE IF NOT EXISTS integration_cache.current_rms_equipment (
  id TEXT PRIMARY KEY,
  original_data JSONB NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  quantity INTEGER,
  available_quantity INTEGER,
  daily_rate DECIMAL(10,2),
  replacement_cost DECIMAL(10,2),
  manufacturer_id TEXT,
  location_id TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  sync_error TEXT,
  etag TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS for cache tables
ALTER TABLE integration_cache.current_rms_equipment ENABLE ROW LEVEL SECURITY;

-- Equipment is viewable by all authenticated users
CREATE POLICY "Equipment is viewable by all authenticated users"
  ON integration_cache.current_rms_equipment
  FOR SELECT
  TO authenticated
  USING (true);

-- Add trigger for cache table
CREATE TRIGGER update_current_rms_equipment_updated_at
  BEFORE UPDATE ON integration_cache.current_rms_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for cache tables
CREATE INDEX IF NOT EXISTS idx_current_rms_equipment_category
  ON integration_cache.current_rms_equipment(category);

CREATE INDEX IF NOT EXISTS idx_current_rms_equipment_name
  ON integration_cache.current_rms_equipment(name);

CREATE INDEX IF NOT EXISTS idx_current_rms_equipment_last_synced
  ON integration_cache.current_rms_equipment(last_synced_at);
