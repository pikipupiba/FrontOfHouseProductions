# Auth Flow Testing Strategy

This document outlines the comprehensive testing strategy for the refactored authentication flow implementation, including test types, test coverage goals, and testing tools.

## Testing Goals

1. Validate the correctness of the refactored authentication implementation
2. Ensure all existing functionality works as expected after refactoring
3. Verify proper handling of edge cases and error conditions
4. Achieve high test coverage for the auth service implementation
5. Create a maintainable test suite that will facilitate future changes

## Test Types

### 1. Unit Tests

Unit tests will focus on testing individual components and functions in isolation:

- **Auth Service Methods**: Testing each method in the auth service
- **Error Handling Functions**: Testing error handling utilities
- **Utility Functions**: Testing helper functions

#### Example: Testing `signInWithEmail` Method

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
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockProfile = { id: 'user-123', email: 'test@example.com', full_name: 'Test User' };
      const mockRole = { user_id: 'user-123', role: 'customer', is_approved: true };
      
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null
      });
      
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: mockProfile,
        error: null
      });
      
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: mockRole,
        error: null
      });
      
      // Act
      const result = await authService.signInWithEmail('test@example.com', 'password');
      
      // Assert
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        auth: {
          id: 'user-123',
          email: 'test@example.com',
          provider: undefined,
          user_metadata: undefined,
          app_metadata: undefined
        },
        profile: mockProfile,
        role: mockRole
      });
    });
    
    it('should handle authentication errors', async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid login credentials', code: 'invalid_credentials' }
      });
      
      // Act
      const result = await authService.signInWithEmail('test@example.com', 'wrong-password');
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        code: 'invalid_credentials',
        message: 'Invalid login credentials',
        details: expect.any(Object)
      });
    });
  });
  
  // Additional test cases for other methods...
});
```

### 2. Integration Tests

Integration tests will verify the interaction between multiple components:

- **Auth Service + Supabase Client**: Testing real API interactions
- **Auth Callback Flow**: Testing the complete OAuth callback flow
- **Auth Context + Hooks**: Testing React context provider and hooks

#### Example: Testing OAuth Callback Flow

```typescript
// /tests/integration/auth-callback.test.ts

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { createServerClient } from '@supabase/ssr';
import { serverAuthService } from '@/lib/services/server-auth-service';

// Mock Next.js cookies API
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => ({ value: `mock-cookie-${name}` })),
    set: jest.fn(),
  })),
}));

// Mock Supabase server client
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
      getUser: jest.fn(),
    },
    rpc: jest.fn(),
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));

describe('Auth Callback Flow', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = createServerClient();
  });
  
  it('should handle the OAuth callback successfully', async () => {
    // Arrange
    const mockCode = 'mock-auth-code';
    const mockUser = { 
      id: 'user-123', 
      email: 'test@example.com',
      app_metadata: { provider: 'google' },
      user_metadata: { full_name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' }
    };
    
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValueOnce({
      error: null
    });
    
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    });
    
    // Mock profile and role queries/mutations
    // ...
    
    // Act
    const result = await serverAuthService.handleAuthCallback(mockCode);
    
    // Assert
    expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(mockCode);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      auth: expect.objectContaining({
        id: 'user-123',
        email: 'test@example.com',
        provider: 'google'
      }),
      profile: expect.any(Object),
      role: expect.any(Object)
    });
  });
  
  it('should handle exchange code errors', async () => {
    // Arrange
    const mockCode = 'invalid-code';
    
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValueOnce({
      error: { message: 'Invalid code', code: 'invalid_code' }
    });
    
    // Act
    const result = await serverAuthService.handleAuthCallback(mockCode);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      code: 'invalid_code',
      message: 'Invalid code',
      details: expect.any(Object)
    });
  });
  
  // Additional test cases for other scenarios...
});
```

### 3. Component Tests

Component tests will verify the behavior of React components that use authentication:

- **Login Component**: Testing sign-in functionality
- **GoogleSignInButton**: Testing OAuth button behavior
- **Auth-Protected Components**: Testing components that depend on auth state

#### Example: Testing Login Component

```typescript
// /tests/components/login.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/auth/login/page';
import { AuthProvider } from '@/app/auth/providers/auth-provider';
import { authService } from '@/lib/services/auth-service';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

// Mock auth service
jest.mock('@/lib/services/auth-service', () => ({
  authService: {
    signInWithEmail: jest.fn(),
    signInWithOAuth: jest.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render login form correctly', () => {
    // Arrange & Act
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    // Assert
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });
  
  it('should call signInWithEmail on form submission', async () => {
    // Arrange
    (authService.signInWithEmail as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { id: 'user-123' },
      error: null,
    });
    
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    // Act
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Assert
    await waitFor(() => {
      expect(authService.signInWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });
  
  // Additional test cases...
});
```

### 4. End-to-End Tests

For critical flows, implement limited end-to-end tests:

- **Login Flow**: Complete login flow from UI to redirect
- **Google OAuth Flow**: OAuth authentication and callback

## Testing Tools

### Jest

Jest will be the primary testing framework:

- **Test Runner**: Running all test types
- **Mocking**: Creating mocks of services and API calls
- **Assertions**: Verifying expected behavior

### React Testing Library

For component tests:

- **Rendering**: Rendering React components
- **Querying**: Selecting elements for testing
- **User Events**: Simulating user interactions

### Mock Service Worker (MSW)

For API mocking:

- **Request Interception**: Intercepting API calls
- **Response Mocking**: Providing controlled responses
- **Error Simulation**: Testing error handling

## Testing Edge Cases

The authentication flow has several edge cases that need specific test coverage:

### 1. Email Validation Edge Cases

- **Null Email**: Test handling of null email fields from Google auth
- **Empty Email**: Test handling of empty email strings
- **Missing Email**: Test handling of undefined email values

### 2. Error Handling Cases

- **Network Errors**: Test handling of network failures
- **API Errors**: Test handling of various API error responses
- **Database Errors**: Test handling of database constraints and errors

### 3. OAuth Error Scenarios

- **Missing Code**: Test handling of missing code parameter
- **Invalid Code**: Test handling of invalid authentication codes
- **Provider Errors**: Test handling of errors from the OAuth provider

### 4. Authentication State

- **Session Expiry**: Test handling of expired sessions
- **Invalid Tokens**: Test handling of invalid or malformed tokens
- **Concurrent Logins**: Test handling of concurrent authentication attempts

## Test Coverage Goals

Aim for the following test coverage metrics:

- **Auth Service**: 90%+ code coverage
- **Auth Context Provider**: 80%+ code coverage
- **Server Auth Service**: 85%+ code coverage
- **Error Handling Utilities**: 95%+ code coverage

## Test Organization

Tests will be organized in a structure that mirrors the source code:

```
/tests
  /unit
    /services
      /auth-service.test.ts
      /server-auth-service.test.ts
    /utils
      /error-handlers.test.ts
  /integration
    /auth-flow.test.ts
    /auth-callback.test.ts
  /components
    /login.test.tsx
    /google-sign-in-button.test.tsx
    /auth-provider.test.tsx
  /e2e
    /login-flow.test.ts
```

## Testing Challenges

### 1. OAuth Testing

Testing OAuth flows presents challenges:

- **External Redirects**: OAuth involves redirects to external providers
- **Callback Handling**: Simulating callback requests with valid codes
- **Session Management**: Managing session state during tests

**Solution**: Use MSW to mock OAuth endpoints and simulate the complete flow without external dependencies.

### 2. Server Component Testing

Testing server components in Next.js can be challenging:

- **Server vs. Client Code**: Separating server and client code in tests
- **Cookie Handling**: Mocking Next.js cookie storage
- **Server Actions**: Testing server actions and routes

**Solution**: Create proper mocks for Next.js server utilities and test server components in isolation.

### 3. Error Simulation

Simulating all possible error scenarios can be complex:

- **Database Errors**: Various database constraint violations
- **Auth Provider Errors**: Different OAuth provider error responses
- **Network Errors**: Various network failure scenarios

**Solution**: Create comprehensive error simulation utilities and test each error type explicitly.

## Testing Implementation Timeline

| Phase | Task | Timeline |
|-------|------|----------|
| 1 | Set up testing infrastructure (Jest, RTL, MSW) | Day 1 |
| 2 | Create unit tests for auth service | Days 2-3 |
| 3 | Implement integration tests for auth flow | Days 4-5 |
| 4 | Add component tests for UI elements | Days 6-7 |
| 5 | Create end-to-end tests for critical flows | Days 8-9 |
| 6 | Test edge cases and error scenarios | Day 10 |

## Conclusion

This testing strategy provides a comprehensive approach to validating the refactored authentication flow. By combining unit, integration, component, and end-to-end tests, we can ensure the reliability and correctness of the implementation while facilitating future maintenance and extensions.
