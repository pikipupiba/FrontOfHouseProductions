# Auth Flow Integration Details

This document outlines the integration details for the authentication flow refactoring, including external dependencies, API interactions, and service integration points.

## External Dependencies

### Supabase Auth

The authentication system is built on top of Supabase Auth, which provides:

- Email/password authentication
- OAuth providers integration (Google)
- JWT generation and validation
- Session management
- User management API

#### Key Supabase Auth Endpoints

| Endpoint | Purpose | Usage |
|----------|---------|-------|
| `/auth/v1/token` | Exchange OAuth code for token | Used in the callback route |
| `/auth/v1/user` | Get current user information | Used to retrieve user details |
| `/auth/v1/logout` | Sign out user | Used for user logout |

### Google OAuth

Google authentication is implemented using OAuth 2.0 with the following flow:

1. User clicks "Sign in with Google" button
2. User is redirected to Google's authentication page
3. After authentication, Google redirects back with a code
4. The code is exchanged for a session token
5. User information is retrieved from the token

#### Google OAuth Configuration

- **Redirect URI**: `/auth/callback`
- **Required Scopes**: `profile`, `email`
- **Response Type**: `code`

## Database Integration

The authentication system interacts with the following database tables:

### Profiles Table

Stores user profile information linked to auth users:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Roles Table

Stores role assignments for users:

```sql
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer',
  is_approved BOOLEAN DEFAULT TRUE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);
```

## RPC Functions

The authentication system relies on several database functions for profile and role management:

### ensure_user_has_profile_and_role

Creates both profile and role records for a user if they don't exist:

```sql
CREATE OR REPLACE FUNCTION ensure_user_has_profile_and_role(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Get user details from auth.users
  SELECT email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'
  INTO user_email, user_name, user_avatar
  FROM auth.users
  WHERE id = user_uuid;
  
  -- Handle NULL email
  IF user_email IS NULL THEN
    user_email := 'user_' || user_uuid || '@placeholder.com';
  END IF;
  
  -- Create profile if it doesn't exist
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (user_uuid, user_email, COALESCE(user_name, ''), COALESCE(user_avatar, ''))
  ON CONFLICT (id) DO NOTHING;
  
  -- Create role if it doesn't exist
  INSERT INTO user_roles (user_id, role, is_approved)
  VALUES (user_uuid, 'customer', TRUE)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error ensuring user profile and role: %', SQLERRM;
    RETURN FALSE;
END;
$$;
```

### emergency_create_profile

Fallback function for profile creation:

```sql
CREATE OR REPLACE FUNCTION emergency_create_profile(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create placeholder profile for user
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    user_uuid, 
    'user_' || user_uuid || '@placeholder.com',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error in emergency profile creation: %', SQLERRM;
    RETURN FALSE;
END;
$$;
```

## Client-Side Integration

### Supabase Client Initialization

The Supabase client is initialized differently for client-side and server-side operations:

#### Client-Side Initialization

```typescript
// /lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient();
};
```

#### Server-Side Initialization

```typescript
// /lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

## Integration Challenges

### 1. Email Validation Challenges

Google authentication occasionally returns users with null email fields, which causes issues with database constraints:

```typescript
// Current workaround in callback route
let email = '';

if (user.email === null || user.email === undefined) {
  console.log('Email is null/undefined, using placeholder');
  email = `user_${user.id}@placeholder.com`;
} else if (user.email === '') {
  console.log('Email is empty string, using placeholder');
  email = `user_${user.id}@placeholder.com`;
} else {
  email = user.email;
  console.log('Using email from user object:', email);
}
```

### 2. Parameter Naming Inconsistencies

The RPC functions have inconsistent parameter naming:

```typescript
// Some functions use user_id
await supabase.rpc('some_function', { user_id: user.id });

// Others use user_uuid
await supabase.rpc('other_function', { user_uuid: user.id });
```

### 3. Session Handling

The authentication flow needs to handle session state properly across redirects:

```typescript
// Exchange the code for a session
const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
```

## Integration Points for Refactoring

### 1. Auth Service Integration

The new auth service will need to integrate with Supabase Auth at these points:

- **Authentication**: Sign in/sign up operations
- **Session Management**: Handling authentication state
- **User Profile**: User data retrieval and updates

### 2. Database Integration

The database integration will be abstracted through service methods:

- **Profile Management**: Creating and updating user profiles
- **Role Management**: Assigning and verifying user roles

### 3. Error Handling Integration

A consistent error handling approach will be implemented:

- **Standardized Error Format**: Consistent error object structure
- **Centralized Error Handling**: Common error handling utilities
- **User-Friendly Messages**: Mapping technical errors to user messages

## Integration Testing Approach

To verify the integration between components, the following testing approach will be used:

1. **Mock Supabase Responses**: Using Jest mocks for Supabase client
2. **API Endpoint Mocking**: Using MSW (Mock Service Worker) for OAuth endpoints
3. **Integration Test Scenarios**: Testing complete authentication flows
4. **Edge Case Coverage**: Testing error scenarios and fallback mechanisms

## Conclusion

The auth flow refactoring will maintain integration with existing services while improving the architecture. By centralizing the integration logic in dedicated services, we'll ensure more consistent behavior, better error handling, and improved maintainability.
