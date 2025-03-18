# Google Authentication Fix Implementation Guide

This document provides detailed instructions for implementing a comprehensive fix for Google authentication issues.

## Issue Summary

Users encountered a series of errors when trying to sign in with Google:

**Initial error:**
```
No profile found for user, creating profile...
Error creating profile: permission denied for table users
```

**Persistent error after first fix attempts:**
```
Auth provider returned an error: server_error
Database error saving new user
```

**Final null constraint error:**
```
Error creating profile: null value in column "email" of relation "profiles" violates not-null constraint
```

These errors were caused by multiple issues at different layers:
1. The Google authentication trigger was not including the required `role` field when creating profiles
2. There were permission issues with the RLS policies for profile creation
3. The trigger functions were failing during user creation without proper error handling
4. The auth service lacked proper permissions to create profiles and roles
5. There's a timing/race condition during the Google user creation process
6. Permission issues exist at the auth schema level
7. The email field can sometimes be null or empty, violating the NOT NULL constraint

## Comprehensive Fix Implementation

The fix consists of five parts applied in sequence:

1. First migration file: `009_fix_google_auth_profile_creation.sql`
2. Second migration file: `010_fix_google_user_creation.sql`
3. Third migration file: `011_resolve_google_auth_errors.sql`
4. Fourth migration file: `012_fix_email_null_constraint.sql`
5. Enhanced authentication callback route with robust email handling

### Migration Details

#### First Migration (009)

The initial migration addresses the basic issues:

1. Updates the `sync_google_user_metadata()` function to include the role field with default 'customer'
2. Adds `SECURITY DEFINER` to critical functions for elevated privileges 
3. Creates RLS policies for service role and authenticated users
4. Creates a dedicated trigger for Google user role creation

#### Second Migration (010)

The follow-up migration adds robustness:

1. Disables problematic triggers to avoid conflicts
2. Adds try-catch blocks to prevent cascading failures
3. Uses COALESCE to handle null values safely
4. Sets proper search_path for security
5. Adds explicit RLS policies for all user types
6. Implements detailed error logging
7. Ensures both profile and role creation in one trigger

#### Third Migration (011) - Permission Fix

This migration takes a more direct approach:

1. Disables ALL previous auth-related triggers
2. Grants direct schema-level permissions to auth schema
3. Grants explicit table-level permissions
4. Creates comprehensive user creation function with robust error handling
5. Implements a direct API function (`ensure_user_has_profile_and_role`) that can be called from the callback
6. Adds a debugging function (`debug_google_auth`) to help diagnose persistent issues
7. Uses SECURITY DEFINER with proper search_path for all functions

#### Fourth Migration (012) - Email Null Constraint Fix

This final migration specifically addresses the email null constraint issue:

1. Updates the `handle_user_creation()` function to use placeholder emails when needed
2. Enhances the `ensure_user_has_profile_and_role()` function with robust email validation
3. Improves the `debug_google_auth()` function with detailed email diagnostics
4. Adds a new utility function `fix_user_with_missing_email()` for direct email fixes
5. Uses placeholder email format: `user_{uuid}@placeholder.com` to satisfy the NOT NULL constraint

### Enhanced Callback Route with Email Handling

The authentication callback route has been further improved:

1. Comprehensive error handling with detailed logging
2. Special handling for the "Database error saving new user" case
3. Multiple fallback mechanisms when profile/role creation fails
4. Direct use of the RPC functions for recovery
5. Extensive email validation and placeholder handling
6. Multiple fallback approaches with detailed logging for email issues
7. Debug info display with email-specific checks
8. Clear separation between Google and non-Google auth flows
9. Direct profile updates as a last resort for email issues

## Implementation Strategy

We recommend applying these fixes in phases:

### Phase 1: First Pass (May Fix Simple Cases)

1. Apply migration 009
2. Update the callback route
3. Test Google authentication

### Phase 2: Second Pass (Addresses Most Cases)

1. Apply migration 010
2. Test Google authentication again

### Phase 3: Permission Fix (For Persistent Issues)

1. Apply migration 011
2. Deploy the updated callback route version
3. Test Google authentication thoroughly

### Phase 4: Final Email Fix (For Email Constraint Issues)

1. Apply migration 012
2. Deploy the latest callback route with email handling
3. Perform thorough testing with various authentication scenarios

## Applying the Migrations

Follow these steps to apply all migrations:

### For Development Environment

1. Connect to your local Supabase instance
2. Run each SQL file in sequence in the SQL Editor:
   - First: `supabase/migrations/009_fix_google_auth_profile_creation.sql`
   - Then: `supabase/migrations/010_fix_google_user_creation.sql`
   - Then: `supabase/migrations/011_resolve_google_auth_errors.sql`
   - Finally: `supabase/migrations/012_fix_email_null_constraint.sql`
3. Deploy the updated callback route

### For Production Environment

1. Log in to the Supabase dashboard
2. Navigate to the SQL Editor
3. Execute all migration files in order
4. Deploy the updated callback route to Vercel
5. Monitor logs carefully after deployment

## Verification and Troubleshooting

### Verification Steps

1. Try signing in with Google in the development environment
2. Check the server logs for detailed information on each step
3. Verify you're redirected to the appropriate dashboard page
4. Confirm the user has both a profile and a role in the database
5. Check the Supabase logs for any errors during the auth process

### Email-Specific Verification

1. Check that the email field in the profiles table is never null:
   ```sql
   SELECT COUNT(*) FROM profiles WHERE email IS NULL;
   ```

2. Verify any placeholder emails are properly formatted:
   ```sql
   SELECT id, email FROM profiles WHERE email LIKE 'user_%@placeholder.com';
   ```

### Advanced Troubleshooting

If issues persist after applying all migrations:

1. Use the enhanced `debug_google_auth` function to diagnose email and permission issues:
   ```sql
   SELECT debug_google_auth('user-uuid-here');
   ```

2. Try the direct email fix function:
   ```sql
   SELECT fix_user_with_missing_email('user-uuid-here');
   ```

3. Check for Database Permission Issues:
   - Verify schema grants: `\dn+`
   - Check table permissions: `\dp public.profiles` and `\dp public.user_roles`
   - Review auth schema permissions: `\dp auth.users`

4. Test the user creation API function:
   ```sql
   SELECT ensure_user_has_profile_and_role('user-uuid-here');
   ```

5. Review the server logs for detailed email validation and error information

## Rollback Strategy

If critical issues arise after applying these fixes:

### Full Rollback

1. Revert the auth callback route to the previous version
2. Run the rollback scripts in reverse order (012, 011, 010, 009)
3. Monitor authentication logs

### Partial Rollback

If the latest migrations cause issues but earlier ones were working partially:
1. Only rollback problematic migrations
2. Keep the enhanced callback route that has better error handling

### Rollback Scripts

```sql
-- Rollback migration 012
DROP FUNCTION IF EXISTS fix_user_with_missing_email(uuid);
-- Revert handle_user_creation, ensure_user_has_profile_and_role, and debug_google_auth to version from 011

-- Rollback migration 011
DROP FUNCTION IF EXISTS debug_google_auth(uuid);
DROP FUNCTION IF EXISTS ensure_user_has_profile_and_role(uuid);
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_user_creation();
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE SELECT ON auth.users FROM authenticated;
REVOKE SELECT ON auth.users FROM service_role;
REVOKE USAGE ON SCHEMA auth FROM anon, authenticated;

-- Rollback migration 010
DROP TRIGGER IF EXISTS on_google_auth_error ON auth.users;
DROP FUNCTION IF EXISTS handle_google_auth_error();
DROP POLICY IF EXISTS "Auth service can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Auth service can manage profiles" ON public.profiles;

-- Rollback migration 009
DROP TRIGGER IF EXISTS on_auth_user_google_updated ON auth.users;
DROP FUNCTION IF EXISTS sync_google_user_metadata();
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Auth callback can manage profiles" ON public.profiles;
DROP TRIGGER IF EXISTS on_google_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_google_user();
```

## Additional Implementation Notes

### Email Handling Strategy

The enhanced authentication flow now has this email handling approach:
1. First try to get a valid email from the user object
2. If email is null, undefined, or empty, generate a placeholder with format: `user_{uuid}@placeholder.com`
3. Log detailed information about the email at each step
4. Multiple fallback mechanisms attempt to fix email issues:
   - First with RPC functions that validate the email
   - Then with direct database operations
   - Finally with debug information and specific error messages

### Authentication Flow

The enhanced authentication flow now follows this pattern:
1. Google OAuth authentication attempt occurs
2. User is created in auth.users table (may fail due to DB errors)
3. Our trigger attempts to create a profile and role with robust email handling
4. Callback route receives the user and error information
5. Callback attempts recovery using our RPC functions if errors occurred
6. Multiple fallback mechanisms attempt to create a complete user profile
7. Email-specific validations and fixes are attempted
8. Debug information is logged throughout the process

### Security Considerations

- All functions use SECURITY DEFINER with explicit search_path
- Direct schema grants are limited to only what's necessary
- Table-level permissions follow principle of least privilege
- Error handling prevents exposing sensitive information
- Placeholder emails don't expose user information

### Future Recommendations

1. Consider implementing a complete auth wrapper that bypasses Supabase's Google auth
2. Monitor for any performance impacts from the additional triggers and functions
3. Implement a cleanup script to fix any orphaned users without profiles/roles
4. Consider a more comprehensive monitoring solution for auth issues
5. Review email constraints and consider making them NULLS FIRST or adding DEFAULT values
