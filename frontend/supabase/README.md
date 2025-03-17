# Supabase Migrations

This directory contains SQL migration files for the Supabase database used in the Front of House Productions application.

## Migrations

- `001_initial_schema.sql` - Initial database schema with profiles, equipment, rentals, and documents tables
- `002_create_user_roles.sql` - Creates a separate user_roles table to avoid circular dependencies
- `003_fix_profiles_rls_policies.sql` - Fixes the infinite recursion by updating profiles table policies
- `004_fix_user_roles_policies.sql` - Creates security definer functions to break circular dependencies in role checks
- `005_add_developer_policy.sql` - Adds permissive policies for role management in development

## Applying Migrations

### Using Supabase CLI

If you have the Supabase CLI installed, you can run migrations with:

```bash
supabase db reset
```

Or to apply just the latest migration:

```bash
supabase db push
```

### Using Supabase Dashboard

1. Go to the Supabase Dashboard for your project
2. Navigate to the SQL Editor
3. Copy the content of the migration file
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

## Migrations 002, 003, 004 & 005: Role Management and RLS Fixes

These migrations address role management and Row Level Security (RLS) issues:

1. **Migration 002**: Creates a separate `user_roles` table to avoid circular dependencies between tables
2. **Migration 003**: Fixes policies on the profiles table to reference the user_roles table
3. **Migration 004**: Creates SECURITY DEFINER functions to break circular dependencies within the user_roles table
4. **Migration 005**: Adds development-friendly policies for testing different roles

The issues occurred because:

1. The profiles table had policies that checked the profiles table itself (fixed in 002 & 003)
2. The user_roles table had policies that checked the user_roles table itself (fixed in 004)

### Changes Made in Migration 002:

1. Created a separate `user_roles` table to store role information
2. Added a new `user_role_requests` table to handle role change requests
3. Created a trigger to automatically create roles for new users
4. Updated policies in other tables to reference the new user_roles table

### Changes Made in Migration 003:

1. Dropped and recreated all policies on the profiles table
2. Removed circular dependencies by ensuring profiles policies use user_roles table
3. Added proper policies for insert, update, and select operations
4. Added a trigger to keep email in sync with auth.users
5. Left the role field in the profiles table for now (for backward compatibility)

### Changes Made in Migration 004:

1. Created SECURITY DEFINER functions to bypass RLS during role checks:
   - `is_manager()` - Checks if a user has manager role
   - `is_employee_or_manager()` - Checks if a user has employee or manager role
2. Updated all policies across tables to use these functions
3. This breaks circular dependencies even within the same table

### Changes Made in Migration 005:

1. Replaced the restrictive "Users can update their own customer role" policy with a more permissive one
2. Added an insert policy to allow users to create their own roles
3. These changes enable the development tools for role testing
4. Note: In production, you would want stricter policies in place

### User Experience Improvements:

1. Users can update their profile information without infinite recursion errors
2. Role change requests now go through an approval process
3. Customer role changes are automatically approved
4. Non-customer role changes require manager approval
5. UI shows pending approval status

## Schema Changes

### New Tables:

1. `user_roles` - Stores user role information
   - `id`: UUID (primary key)
   - `user_id`: UUID (references auth.users)
   - `role`: TEXT ('customer', 'employee', or 'manager')
   - `is_approved`: BOOLEAN
   - `created_at`, `updated_at`: TIMESTAMPTZ

2. `user_role_requests` - Tracks role change requests
   - `id`: UUID (primary key)
   - `user_id`: UUID (references auth.users)
   - `requested_role`: TEXT
   - `current_role`: TEXT
   - `status`: TEXT ('pending', 'approved', or 'rejected')
   - `notes`: TEXT
   - `created_at`, `updated_at`: TIMESTAMPTZ

### Modified Policies:

All manager-related policies across tables now reference the `user_roles` table instead of the `profiles` table.
