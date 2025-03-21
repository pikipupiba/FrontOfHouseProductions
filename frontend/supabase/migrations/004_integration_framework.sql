------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 004_integration_framework.sql
------------------------------------------------------------------
-- This migration establishes the integration framework infrastructure, including:
-- - Integration cache schema
-- - Credentials storage tables
-- - Cache metadata tracking
-- - Required RLS policies for integration tables
------------------------------------------------------------------

------------------------------------------------------------------
-- INTEGRATION SCHEMAS
------------------------------------------------------------------

-- Create schema for integration cache if it doesn't exist
CREATE SCHEMA IF NOT EXISTS integration_cache;

------------------------------------------------------------------
-- CREDENTIALS STORAGE
------------------------------------------------------------------

-- Create integration credentials table for storing encrypted API credentials
CREATE TABLE IF NOT EXISTS public.integration_credentials (
  service_name TEXT PRIMARY KEY,
  credentials TEXT NOT NULL, -- Encrypted JSON
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------------
-- CACHE METADATA
------------------------------------------------------------------

-- Create cache metadata table to track sync status
CREATE TABLE IF NOT EXISTS integration_cache.metadata (
  service_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  last_full_sync TIMESTAMPTZ,
  last_incremental_sync TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  sync_token TEXT,
  next_page_token TEXT,
  sync_status TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (service_name, resource_type)
);

------------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------------

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

------------------------------------------------------------------
-- HELPER FUNCTIONS
------------------------------------------------------------------

-- Utility function to get JWT user ID
CREATE OR REPLACE FUNCTION public.get_auth_uid_text()
RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE SQL STABLE;

------------------------------------------------------------------
-- INDEXES
------------------------------------------------------------------

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_metadata_service
  ON integration_cache.metadata(service_name);

CREATE INDEX IF NOT EXISTS idx_integration_metadata_last_sync
  ON integration_cache.metadata(last_incremental_sync);

------------------------------------------------------------------
-- ROW LEVEL SECURITY
------------------------------------------------------------------

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

------------------------------------------------------------------
-- EXAMPLE CACHE TABLE (FOR REFERENCE)
------------------------------------------------------------------

-- Example cache table structure (can be used as template for actual integrations)
CREATE TABLE IF NOT EXISTS integration_cache.example_resource (
  id TEXT NOT NULL,
  original_data JSONB NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  last_synced_at TIMESTAMPTZ NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  sync_error TEXT,
  etag TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- Enable RLS for example table
ALTER TABLE integration_cache.example_resource ENABLE ROW LEVEL SECURITY;

-- Example policy for cache table
CREATE POLICY "Users can view only their own cached resources"
  ON integration_cache.example_resource
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Example trigger for cache table
CREATE TRIGGER update_example_resource_updated_at
  BEFORE UPDATE ON integration_cache.example_resource
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON SCHEMA integration_cache IS 'Schema for storing cached data from external integrations';
COMMENT ON TABLE public.integration_credentials IS 'Secure storage for integration service credentials';
COMMENT ON TABLE integration_cache.metadata IS 'Metadata tracking for integration sync operations';
COMMENT ON TABLE integration_cache.example_resource IS 'Example structure for integration cache tables';

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to automatically update the updated_at timestamp';
COMMENT ON FUNCTION get_auth_uid_text() IS 'Helper function to retrieve the current authenticated user ID as text';
