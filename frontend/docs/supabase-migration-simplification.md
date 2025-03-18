# Supabase Migration Simplification

## Overview

This document details the process of simplifying and consolidating the Supabase migrations for the Front of House Productions project. The original migrations (001-013) had become difficult to maintain due to incremental fixes and patching, particularly around Google authentication and integration.

The consolidated migrations maintain all functionality while improving organization, readability, and maintainability.

## Problem Analysis

The original migrations had several issues:

1. **Incremental Patching**: Migrations 009-013 repeatedly modified the same functions to fix Google authentication issues, leading to confusion about which version was current and correct.

2. **Inconsistent Parameter Naming**: Functions used different parameter names (`user_id` vs `user_uuid`) across different versions, making it difficult to follow the logic.

3. **Trigger Management Issues**: Triggers were repeatedly dropped and recreated with different implementations.

4. **Permission Escalation**: Increasingly aggressive permissions were added to fix authentication problems, without a clear strategy.

5. **Redundant Error Handling**: Multiple versions of similar error handling logic were scattered across migrations.

6. **Mixed Responsibility**: Schema changes, functions, triggers, and policies were intermingled without clear organization.

## Solution Approach

We consolidated the migrations into six logical files:

1. **001_core_schema.sql**: Core database tables and basic RLS policies
2. **002_user_roles.sql**: User role management system
3. **003_security_functions.sql**: Role-based security functions and policies
4. **004_integration_framework.sql**: Integration framework infrastructure
5. **005_google_auth.sql**: Google authentication handlers
6. **006_google_workspace.sql**: Google Workspace integration

Each file focuses on a specific aspect of the database schema with clear dependencies and organization.

## Key Improvements

### 1. Consistent Parameter Naming

Standardized on `user_id` across all functions for consistency:

```sql
-- Before (inconsistent):
CREATE OR REPLACE FUNCTION ensure_user_has_profile_and_role(user_uuid uuid)
...
CREATE OR REPLACE FUNCTION fix_user_with_missing_email(user_id uuid)

-- After (consistent):
CREATE OR REPLACE FUNCTION ensure_user_has_profile_and_role(user_id_param uuid)
...
CREATE OR REPLACE FUNCTION fix_user_with_missing_email(user_id_param uuid)
```

### 2. Comprehensive Error Handling

All functions now include robust error handling:

```sql
BEGIN
  -- Try operation
  ...
EXCEPTION WHEN OTHERS THEN
  -- Log error and continue
  RAISE LOG 'Error creating profile for user %: %, email: %', NEW.id, SQLERRM, user_email;
END;
```

### 3. Clear Security Context

All functions now have explicit security context:

```sql
CREATE OR REPLACE FUNCTION some_function()
...
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### 4. Optimized Queries

Added indexes for performance-critical tables:

```sql
CREATE INDEX IF NOT EXISTS idx_google_drive_files_name
  ON integration_cache.google_drive_files(name);

CREATE INDEX IF NOT EXISTS idx_google_drive_files_mime_type
  ON integration_cache.google_drive_files(mime_type);
```

### 5. Improved Documentation

Each file has clear section headers and comments:

```sql
------------------------------------------------------------------
-- GOOGLE WORKSPACE CACHE TABLES
------------------------------------------------------------------

-- Google Calendar Events Cache
CREATE TABLE IF NOT EXISTS integration_cache.google_calendar_events (
  ...
```

### 6. Email Handling Fixes

Comprehensive NULL email handling:

```sql
-- Enhanced email handling: use TRIM to remove whitespace and check for null
IF NEW.email IS NULL OR TRIM(COALESCE(NEW.email, '')) = '' THEN
  user_email := 'user_' || NEW.id || '@placeholder.com';
  RAISE LOG 'Google user has no valid email, using placeholder: %', user_email;
ELSE
  user_email := TRIM(NEW.email);
  RAISE LOG 'Using trimmed Google user email: %', user_email;
END IF;
```

## Implementation Plan

### For Development/Testing

1. Apply the consolidated migrations to a test database:

```bash
# Navigate to project root
cd frontend

# For each migration in order (using Supabase CLI)
npx supabase db push --db-url=<TEST_DB_URL> --migrations-dir=supabase/migrations/consolidated/001_core_schema.sql
# ... repeat for each migration file
```

2. Verify functionality:
   - User authentication (both email and Google)
   - Profile creation and synchronization
   - User role assignment and permissions
   - Google Workspace integration (Drive functionality)

### For Production

1. Create a full database backup first:

```bash
pg_dump -Fc your_database > backup_before_migration.dump
```

2. Apply the consolidated migrations following the same process as for the test environment.

3. Monitor logs for any errors, particularly around authentication and API integration.

## Future Database Changes

When making future database changes:

1. Identify which consolidated file should be modified based on the change type.
2. Update the file with clear section headers and comments.
3. Follow the established naming conventions and patterns.
4. Add indexes for any new columns used in WHERE clauses.
5. Ensure all tables have appropriate RLS policies.

## Additional Resources

- The `frontend/supabase/migrations/consolidated/README.md` file provides detailed information about each migration.
- For complex function debugging, use the `debug_google_auth(user_id)` function to diagnose authentication issues.
- For emergency profile recovery, use the `emergency_create_profile(user_id)` function.
