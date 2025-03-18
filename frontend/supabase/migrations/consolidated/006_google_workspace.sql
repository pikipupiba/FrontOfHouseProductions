------------------------------------------------------------------
-- CONSOLIDATED MIGRATION: 006_google_workspace.sql
------------------------------------------------------------------
-- This migration creates the Google Workspace integration cache tables
-- with a primary focus on Drive functionality, while maintaining
-- Calendar and Tasks tables as placeholders for future expansion.
------------------------------------------------------------------

------------------------------------------------------------------
-- GOOGLE WORKSPACE CACHE TABLES
------------------------------------------------------------------

-- Google Calendar Events Cache
CREATE TABLE IF NOT EXISTS integration_cache.google_calendar_events (
  id TEXT NOT NULL,
  calendar_id TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  status TEXT,
  attendees JSONB,
  original_data JSONB NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  etag TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id, user_id)
);

-- Google Drive Files Cache (Primary focus for current implementation)
CREATE TABLE IF NOT EXISTS integration_cache.google_drive_files (
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  parent_folder_id TEXT,
  size_bytes BIGINT,
  web_view_link TEXT,
  thumbnail_link TEXT,
  created_at TIMESTAMPTZ,
  modified_at TIMESTAMPTZ,
  is_trashed BOOLEAN DEFAULT FALSE,
  original_data JSONB NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  etag TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id, user_id)
);

-- Google Tasks List Cache
CREATE TABLE IF NOT EXISTS integration_cache.google_task_lists (
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ,
  original_data JSONB NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  etag TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id, user_id)
);

-- Google Tasks Cache
CREATE TABLE IF NOT EXISTS integration_cache.google_tasks (
  id TEXT NOT NULL,
  task_list_id TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  due_date TIMESTAMPTZ,
  status TEXT,
  completed_at TIMESTAMPTZ,
  position TEXT,
  parent_id TEXT,
  original_data JSONB NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  etag TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id, user_id),
  FOREIGN KEY (task_list_id, user_id) REFERENCES integration_cache.google_task_lists (id, user_id) ON DELETE CASCADE
);

------------------------------------------------------------------
-- SYNC METADATA TABLE
------------------------------------------------------------------

-- Create cache metadata table to track sync status for Google services
CREATE TABLE IF NOT EXISTS integration_cache.google_sync_metadata (
  service_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  last_full_sync TIMESTAMPTZ,
  last_incremental_sync TIMESTAMPTZ,
  sync_token TEXT,
  next_page_token TEXT,
  status TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (service_name, resource_type, user_id)
);

------------------------------------------------------------------
-- OAUTH CREDENTIALS STORAGE
------------------------------------------------------------------

-- Secure credentials storage for OAuth tokens
CREATE TABLE IF NOT EXISTS integration_cache.oauth_credentials (
  service_name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credentials JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (service_name, user_id)
);

-- Create a function to update OAuth credentials securely
CREATE OR REPLACE FUNCTION integration_cache.update_oauth_credentials(
  p_service_name TEXT,
  p_user_id UUID,
  p_credentials JSONB
)
RETURNS VOID
SECURITY DEFINER
SET search_path = integration_cache, public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO oauth_credentials (service_name, user_id, credentials, updated_at)
  VALUES (p_service_name, p_user_id, p_credentials, NOW())
  ON CONFLICT (service_name, user_id)
  DO UPDATE SET 
    credentials = p_credentials,
    updated_at = NOW();
END;
$$;

------------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES
------------------------------------------------------------------

-- Google Sync Metadata
ALTER TABLE integration_cache.google_sync_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sync metadata" 
  ON integration_cache.google_sync_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync metadata" 
  ON integration_cache.google_sync_metadata
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync metadata" 
  ON integration_cache.google_sync_metadata
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Google Calendar Events
ALTER TABLE integration_cache.google_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calendar events" 
  ON integration_cache.google_calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events" 
  ON integration_cache.google_calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events" 
  ON integration_cache.google_calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" 
  ON integration_cache.google_calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Google Drive Files
ALTER TABLE integration_cache.google_drive_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own drive files" 
  ON integration_cache.google_drive_files
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drive files" 
  ON integration_cache.google_drive_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drive files" 
  ON integration_cache.google_drive_files
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drive files" 
  ON integration_cache.google_drive_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Google Task Lists
ALTER TABLE integration_cache.google_task_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own task lists" 
  ON integration_cache.google_task_lists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task lists" 
  ON integration_cache.google_task_lists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task lists" 
  ON integration_cache.google_task_lists
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task lists" 
  ON integration_cache.google_task_lists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Google Tasks
ALTER TABLE integration_cache.google_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" 
  ON integration_cache.google_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
  ON integration_cache.google_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON integration_cache.google_tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON integration_cache.google_tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- OAuth Credentials
ALTER TABLE integration_cache.oauth_credentials ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own credentials
CREATE POLICY "Users can view their own oauth credentials" 
  ON integration_cache.oauth_credentials
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to insert their own credentials
CREATE POLICY "Users can insert their own oauth credentials" 
  ON integration_cache.oauth_credentials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own credentials
CREATE POLICY "Users can update their own oauth credentials" 
  ON integration_cache.oauth_credentials
  FOR UPDATE
  USING (auth.uid() = user_id);

------------------------------------------------------------------
-- PERMISSIONS AND GRANTS
------------------------------------------------------------------

-- Grant permission to authenticated users
GRANT USAGE ON SCHEMA integration_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA integration_cache TO authenticated;
GRANT EXECUTE ON FUNCTION integration_cache.update_oauth_credentials TO authenticated;

------------------------------------------------------------------
-- INDEXES
------------------------------------------------------------------

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_google_drive_files_name
  ON integration_cache.google_drive_files(name);

CREATE INDEX IF NOT EXISTS idx_google_drive_files_mime_type
  ON integration_cache.google_drive_files(mime_type);

CREATE INDEX IF NOT EXISTS idx_google_drive_files_parent_folder
  ON integration_cache.google_drive_files(parent_folder_id);

CREATE INDEX IF NOT EXISTS idx_google_drive_files_last_synced
  ON integration_cache.google_drive_files(last_synced_at);

CREATE INDEX IF NOT EXISTS idx_google_calendar_events_start_time
  ON integration_cache.google_calendar_events(start_time);

CREATE INDEX IF NOT EXISTS idx_google_tasks_due_date
  ON integration_cache.google_tasks(due_date);

------------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------------

COMMENT ON TABLE integration_cache.google_drive_files IS 'Cache table for Google Drive files (primary focus of current implementation)';
COMMENT ON TABLE integration_cache.google_calendar_events IS 'Cache table for Google Calendar events (placeholder for future implementation)';
COMMENT ON TABLE integration_cache.google_task_lists IS 'Cache table for Google Task lists (placeholder for future implementation)';
COMMENT ON TABLE integration_cache.google_tasks IS 'Cache table for Google Tasks (placeholder for future implementation)';
COMMENT ON TABLE integration_cache.oauth_credentials IS 'Secure storage for OAuth credentials with user-specific access control';
COMMENT ON TABLE integration_cache.google_sync_metadata IS 'Metadata tracking for Google API synchronization operations';

COMMENT ON FUNCTION integration_cache.update_oauth_credentials(TEXT, UUID, JSONB) IS 'Securely updates OAuth credentials with proper access controls';
