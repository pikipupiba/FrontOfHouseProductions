# Auth Flow Refactoring - Implementation Plan

This document outlines the detailed implementation plan for refactoring the authentication flow in the FOHP application.

## Refactoring Goals

1. Centralize authentication logic in dedicated services
2. Improve type safety with comprehensive TypeScript interfaces
3. Simplify the callback route by moving business logic to service layer
4. Create clean separation between UI, business logic, and data access
5. Standardize error handling patterns
6. Enhance testability
7. Enable future extensibility

## New Directory Structure and Files

```
/frontend
  /lib
    /types
      /auth.ts                 # Type definitions for auth
    /services
      /auth-service.ts         # Main auth service implementation
      /user-service.ts         # User profile management
      /role-service.ts         # Role management
    /utils
      /error-handlers.ts       # Centralized error handling utilities
    /api
      /supabase-client.ts      # Wrapper for Supabase client with error handling
    /hooks
      /useAuth.ts              # React hook for auth context
  /app
    /auth
      /callback
        /route.ts              # Simplified callback route
      /providers
        /auth-provider.tsx     # React context provider for auth
```

## Implementation Phases

### Phase 1: Core Infrastructure

**1.1 Create Type Definitions**
- Create comprehensive TypeScript interfaces in `/lib/types/auth.ts`
- Define user, profile, role, and auth operation types
- Create consistent result type for auth operations

**1.2 Implement Error Handling Utilities**
- Create centralized error handling in `/lib/utils/error-handlers.ts`
- Define standard error types and error handling patterns
- Implement user-friendly error message mapping

**1.3 Implement Core Auth Service**
- Create the main auth service in `/lib/services/auth-service.ts`
- Implement core authentication operations
- Add client-side auth functionality

### Phase 2: Server-Side Components

**2.1 Implement Server Auth Service**
- Create server-side auth service in `/lib/services/server-auth-service.ts`
- Implement OAuth callback handling
- Add profile and role management functions

**2.2 Refactor Callback Route**
- Simplify the callback route in `/app/auth/callback/route.ts`
- Move business logic to server auth service
- Implement clean error handling

**2.3 Test OAuth Flow**
- Test the complete OAuth flow end-to-end
- Verify profile creation works correctly
- Ensure proper role-based redirection

### Phase 3: Client-Side Integration

**3.1 Create Auth Context Provider**
- Implement React context provider in `/app/auth/providers/auth-provider.tsx`
- Manage authentication state
- Expose authentication operations to components

**3.2 Implement Auth Hook**
- Create useAuth hook for easy access to auth context
- Provide type-safe interface to auth operations
- Handle loading and error states

**3.3 Refactor UI Components**
- Update login page to use auth service
- Refactor Google Sign-In button
- Update other auth-dependent components

### Phase 4: Testing and Documentation

**4.1 Implement Unit Tests**
- Create unit tests for auth services
- Test error handling
- Mock Supabase client for testing

**4.2 Add Integration Tests**
- Test the complete authentication flow
- Verify all edge cases are handled
- Create mock server for OAuth testing

**4.3 Document Architecture**
- Update documentation
- Create usage examples
- Document testing approach

## Detailed Implementation

### 1. Type Definitions (auth.ts)

```typescript
// /lib/types/auth.ts

// User-related types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  user_id: string;
  role: UserRoleType;
  is_approved: boolean;
  requested_at?: string;
  approved_at?: string;
}

export type UserRoleType = 'customer' | 'employee' | 'manager';

// Auth provider types
export type AuthProvider = 'email' | 'google';

export interface AuthUser {
  id: string;
  email?: string;
  provider?: AuthProvider;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// Composite user type with profile and role
export interface User {
  auth: AuthUser;
  profile?: UserProfile;
  role?: UserRole;
}

// Auth operation result types
export interface AuthResult<T = void> {
  data: T | null;
  error: AuthError | null;
  success: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Auth service interface
export interface IAuthService {
  // Authentication methods
  signInWithEmail(email: string, password: string): Promise<AuthResult<User>>;
  signInWithOAuth(provider: AuthProvider): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
  
  // User management
  getCurrentUser(): Promise<AuthResult<User>>;
  getUserRole(userId: string): Promise<AuthResult<UserRole>>;
  
  // Profile management
  createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>>;
  
  // Role management
  assignUserRole(userId: string, role: UserRoleType, approved?: boolean): Promise<AuthResult<UserRole>>;
  
  // Callback handling
  handleAuthCallback(code: string): Promise<AuthResult<User>>;
  handleAuthRedirect(user: User): Promise<string>; // Returns redirect URL
}
```

### 2. Auth Service Implementation (auth-service.ts)

```typescript
// /lib/services/auth-service.ts

import { createClient } from '@/lib/supabase/client';
import { 
  IAuthService, 
  AuthProvider, 
  AuthResult, 
  User, 
  UserProfile, 
  UserRole, 
  UserRoleType,
  AuthError 
} from '../types/auth';
import { handleAuthError } from '../utils/error-handlers';

export class AuthService implements IAuthService {
  
  // Client-side authentication
  async signInWithEmail(email: string, password: string): Promise<AuthResult<User>> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        return await this.enrichUserData(data.user);
      }
      
      return { data: null, error: null, success: true };
    } catch (error) {
      return handleAuthError(error, 'sign-in-email');
    }
  }
  
  async signInWithOAuth(provider: AuthProvider): Promise<AuthResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      return { data: null, error: null, success: true };
    } catch (error) {
      return handleAuthError(error, 'sign-in-oauth');
    }
  }
  
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { data: null, error: null, success: true };
    } catch (error) {
      return handleAuthError(error, 'sign-out');
    }
  }
  
  // User data retrieval
  async getCurrentUser(): Promise<AuthResult<User>> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (data.user) {
        return await this.enrichUserData(data.user);
      }
      
      return { 
        data: null, 
        error: { 
          code: 'no-user', 
          message: 'No authenticated user found' 
        }, 
        success: false 
      };
    } catch (error) {
      return handleAuthError(error, 'get-current-user');
    }
  }
  
  // Helper to fetch profile and role data
  private async enrichUserData(authUser: any): Promise<AuthResult<User>> {
    try {
      const supabase = createClient();
      
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // Get role
      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }
      
      return {
        data: {
          auth: {
            id: authUser.id,
            email: authUser.email,
            provider: authUser.app_metadata?.provider,
            user_metadata: authUser.user_metadata,
            app_metadata: authUser.app_metadata
          },
          profile: profile || undefined,
          role: role || undefined
        },
        error: null,
        success: true
      };
    } catch (error) {
      return handleAuthError(error, 'enrich-user-data');
    }
  }

  // Additional methods will be implemented
}

// Create a singleton instance for client-side usage
export const authService = new AuthService();
```

### 3. Server-side Auth Service (server-auth-service.ts)

```typescript
// /lib/services/server-auth-service.ts

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { IAuthService, AuthResult, User } from '../types/auth';
import { handleAuthError } from '../utils/error-handlers';

export class ServerAuthService {
  // Handle the OAuth callback
  async handleAuthCallback(code: string): Promise<AuthResult<User>> {
    try {
      const cookieStore = cookies();
      const supabase = createServerClient(
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
      
      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) throw sessionError;
      
      // Get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        return {
          data: null,
          error: { code: 'no-user', message: 'No user found after authentication' },
          success: false
        };
      }
      
      // Ensure profile exists
      await this.ensureUserProfile(supabase, user);
      
      // Ensure role exists
      await this.ensureUserRole(supabase, user);
      
      // Return complete user data
      return await this.getUserData(supabase, user.id);
    } catch (error) {
      return handleAuthError(error, 'auth-callback');
    }
  }
  
  // Additional methods will be implemented
}

// Export instance for server-side only
export const serverAuthService = new ServerAuthService();
```

### 4. Error Handling Utilities (error-handlers.ts)

```typescript
// /lib/utils/error-handlers.ts

import { AuthError, AuthResult } from '../types/auth';

export function handleAuthError(error: any, operation: string): AuthResult {
  console.error(`Auth error in ${operation}:`, error);
  
  const authError: AuthError = {
    code: error.code || 'unknown',
    message: error.message || 'An unknown error occurred',
    details: error
  };
  
  return {
    data: null,
    error: authError,
    success: false
  };
}

export function mapErrorToUserMessage(error: AuthError): string {
  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'The email address is not valid',
    'auth/user-disabled': 'This user account has been disabled',
    'auth/user-not-found': 'No account exists with this email',
    'auth/wrong-password': 'Incorrect password',
    'no-user': 'No user is currently signed in',
    // Add more mappings as needed
  };
  
  return errorMessages[error.code] || error.message;
}
```

### 5. Refactored Callback Route (route.ts)

```typescript
// /app/auth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthService } from '@/lib/services/server-auth-service';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');
  
  // Handle error redirects from OAuth provider
  if (errorParam) {
    console.error('Auth provider returned an error:', {
      error: errorParam,
      description: errorDesc
    });
    
    return NextResponse.redirect(
      new URL(`/auth/login?error=provider_${errorParam}&desc=${encodeURIComponent(errorDesc || '')}`, 
      request.url)
    );
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_auth_code', request.url));
  }
  
  // Exchange code for session and get user data
  const result = await serverAuthService.handleAuthCallback(code);
  
  if (!result.success || !result.data) {
    // Handle error
    const errorMessage = result.error?.message || 'Unknown error';
    const errorCode = result.error?.code || 'unknown';
    
    return NextResponse.redirect(
      new URL(`/auth/login?error=${errorCode}&message=${encodeURIComponent(errorMessage)}`, 
      request.url)
    );
  }
  
  // Get redirect URL based on user role
  const redirectUrl = await serverAuthService.handleAuthRedirect(result.data);
  
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
```

### 6. Auth Context Provider (auth-provider.tsx)

```typescript
// /app/auth/providers/auth-provider.tsx

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth-service';
import { User, AuthResult } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication methods implementation will go here
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        signInWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
```

## Testing Strategy

### Unit Tests

For each service method, create unit tests with mocked Supabase responses:

```typescript
// /tests/unit/services/auth-service.test.ts

import { AuthService } from '@/lib/services/auth-service';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockSupabase: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockSupabase = createClient();
  });
  
  describe('signInWithEmail', () => {
    it('should sign in user with email and password', async () => {
      // Test implementation
    });
    
    it('should handle authentication errors', async () => {
      // Test implementation
    });
  });
  
  // Additional tests for other methods
});
```

### Integration Tests

```typescript
// /tests/integration/auth-flow.test.ts

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { authService } from '@/lib/services/auth-service';

// Mock the Supabase API
const server = setupServer(
  rest.post('https://your-project.supabase.co/auth/v1/token', (req, res, ctx) => {
    return res(ctx.json({ access_token: 'fake-token', user: { id: 'user-id' } }));
  }),
  
  rest.get('https://your-project.supabase.co/auth/v1/user', (req, res, ctx) => {
    return res(ctx.json({ 
      id: 'user-id', 
      email: 'user@example.com',
      app_metadata: { provider: 'email' },
      user_metadata: { full_name: 'Test User' }
    }));
  }),
  
  // Additional mock endpoints
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth Flow Integration', () => {
  it('should handle the complete authentication flow', async () => {
    // Test implementation
  });
});
```

## Implementation Timeline

| Phase | Task | Estimated Effort | Dependencies |
|-------|------|------------------|--------------|
| 1.1 | Create Type Definitions | 1 day | None |
| 1.2 | Implement Error Handling | 1 day | Type Definitions |
| 1.3 | Implement Core Auth Service | 2 days | Type Definitions, Error Handling |
| 2.1 | Implement Server Auth Service | 2 days | Core Auth Service |
| 2.2 | Refactor Callback Route | 1 day | Server Auth Service |
| 2.3 | Test OAuth Flow | 1 day | Refactored Callback Route |
| 3.1 | Create Auth Context | 1 day | Core Auth Service |
| 3.2 | Implement Auth Hook | 1 day | Auth Context |
| 3.3 | Refactor UI Components | 2 days | Auth Hook |
| 4.1 | Implement Unit Tests | 2 days | All Services |
| 4.2 | Add Integration Tests | 2 days | All Components |
| 4.3 | Document Architecture | 1 day | All Implementation |

## Key Benefits

1. **Maintainability**: Centralized auth logic will be easier to understand and modify.
2. **Type Safety**: Comprehensive TypeScript definitions will improve error detection.
3. **Clean Architecture**: Clear separation of concerns will improve code quality.
4. **Testability**: Modular implementation will be easier to test.
5. **Future-Proofing**: Abstracted auth service will support future auth providers.

## Potential Challenges

1. **Migration Strategy**: Need to carefully migrate without breaking existing functionality.
2. **Supabase Version Compatibility**: Ensure compatibility with the current Supabase version.
3. **Edge Cases**: Ensure all existing edge cases are handled properly.
4. **Testing Complexity**: OAuth flows can be challenging to test properly.

## Conclusion

This refactoring plan outlines a comprehensive approach to transforming the authentication implementation from a scattered, complex system to a centralized, modular, and maintainable one. By following this plan, we will significantly improve the codebase's maintainability, testability, and future extensibility.
