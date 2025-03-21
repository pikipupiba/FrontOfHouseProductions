/**
 * Mock Authentication Service
 * 
 * This service provides a mock implementation of the authentication service
 * that mimics the behavior of Supabase Auth but works with static mock data
 * and uses localStorage for session persistence.
 */

import { 
  AuthError, 
  AuthResult, 
  AuthUser, 
  IAuthService, 
  User, 
  UserProfile, 
  UserRole, 
  UserRoleType
} from '@/lib/types/auth';
import { mockUsers, verifyMockCredentials } from '../data/users';

// Session storage key
const SESSION_STORAGE_KEY = 'mock_auth_session';

// Session structure
interface MockSession {
  access_token: string;
  expires_at: number; // timestamp in milliseconds
  user: AuthUser;
}

/**
 * Mock Authentication Service implementing the IAuthService interface
 */
export class MockAuthService implements IAuthService {
  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult<User>> {
    try {
      // Artificial delay to simulate network request
      await this.delay(800);
      
      // Check credentials against mock data
      const userWithoutPassword = verifyMockCredentials(email, password);
      
      if (!userWithoutPassword) {
        return {
          data: null,
          error: {
            code: 'auth/invalid-credentials',
            message: 'Invalid email or password'
          },
          success: false
        };
      }
      
      // Create auth user
      const authUser: AuthUser = {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        provider: 'email',
        user_metadata: {
          firstName: userWithoutPassword.firstName,
          lastName: userWithoutPassword.lastName,
          avatar_url: userWithoutPassword.avatarUrl
        }
      };
      
      // Create profile
      const profile: UserProfile = {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        full_name: userWithoutPassword.firstName && userWithoutPassword.lastName
          ? `${userWithoutPassword.firstName} ${userWithoutPassword.lastName}`
          : undefined,
        avatar_url: userWithoutPassword.avatarUrl,
        created_at: userWithoutPassword.created_at
      };
      
      // Create role
      const role: UserRole = {
        user_id: userWithoutPassword.id,
        role: userWithoutPassword.role,
        is_approved: true,
        approved_at: userWithoutPassword.created_at
      };
      
      // Create user
      const user: User = {
        auth: authUser,
        profile,
        role
      };
      
      // Create session
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      const session: MockSession = {
        access_token: `mock-token-${Date.now()}`,
        expires_at: expiresAt,
        user: authUser
      };
      
      // Store session in localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      
      return {
        data: user,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Sign in with OAuth (simplified mock implementation)
   */
  async signInWithOAuth(provider: 'google'): Promise<AuthResult> {
    try {
      // Artificial delay to simulate network request and OAuth flow
      await this.delay(1500);
      
      // For mock purposes, we'll use a predefined user for each provider
      // In a real implementation, this would redirect to the OAuth provider
      
      // For Google auth, use the first employee (which has the most complete profile)
      const mockEmployee = mockUsers.find(user => user.role === 'employee');
      
      if (!mockEmployee) {
        return {
          data: null,
          error: {
            code: 'auth/provider-error',
            message: 'Error connecting to authentication provider'
          },
          success: false
        };
      }
      
      // Create auth user with provider metadata
      const authUser: AuthUser = {
        id: mockEmployee.id,
        email: mockEmployee.email,
        provider: 'google',
        user_metadata: {
          firstName: mockEmployee.firstName,
          lastName: mockEmployee.lastName,
          avatar_url: mockEmployee.avatarUrl
        }
      };
      
      // Create session
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      const session: MockSession = {
        access_token: `mock-google-token-${Date.now()}`,
        expires_at: expiresAt,
        user: authUser
      };
      
      // Store session in localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      
      // Note: in the real app, this would redirect to the callback URL
      // For the mock, we just return success and let the caller handle redirection
      
      return {
        data: null, // No data needed as there would be a redirect
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/provider-error',
          message: error instanceof Error ? error.message : 'Error connecting to authentication provider'
        },
        success: false
      };
    }
  }
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      // Artificial delay
      await this.delay(300);
      
      // Remove session from localStorage
      localStorage.removeItem(SESSION_STORAGE_KEY);
      
      return {
        data: null,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/signout-error',
          message: error instanceof Error ? error.message : 'Error signing out'
        },
        success: false
      };
    }
  }
  
  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthResult<User>> {
    try {
      // Artificial delay
      await this.delay(300);
      
      // Get session from localStorage
      const sessionJson = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (!sessionJson) {
        return {
          data: null,
          error: null, // No error, just no user
          success: true
        };
      }
      
      // Parse session
      const session = JSON.parse(sessionJson) as MockSession;
      
      // Check if session is expired
      if (session.expires_at < Date.now()) {
        // Session expired, remove it
        localStorage.removeItem(SESSION_STORAGE_KEY);
        
        return {
          data: null,
          error: {
            code: 'auth/session-expired',
            message: 'Session expired'
          },
          success: false
        };
      }
      
      // Find user in mock data
      const mockUser = mockUsers.find(user => user.id === session.user.id);
      
      if (!mockUser) {
        // This shouldn't happen with mock data, but handle it anyway
        return {
          data: null,
          error: {
            code: 'auth/user-not-found',
            message: 'User not found'
          },
          success: false
        };
      }
      
      // Create profile
      const profile: UserProfile = {
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.firstName && mockUser.lastName
          ? `${mockUser.firstName} ${mockUser.lastName}`
          : undefined,
        avatar_url: mockUser.avatarUrl,
        created_at: mockUser.created_at
      };
      
      // Create role
      const role: UserRole = {
        user_id: mockUser.id,
        role: mockUser.role,
        is_approved: true,
        approved_at: mockUser.created_at
      };
      
      // Create user
      const user: User = {
        auth: session.user,
        profile,
        role
      };
      
      return {
        data: user,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Get user role
   */
  async getUserRole(userId: string): Promise<AuthResult<UserRole>> {
    try {
      // Artificial delay
      await this.delay(200);
      
      // Find user in mock data
      const mockUser = mockUsers.find(user => user.id === userId);
      
      if (!mockUser) {
        return {
          data: null,
          error: {
            code: 'auth/user-not-found',
            message: 'User not found'
          },
          success: false
        };
      }
      
      // Create role
      const role: UserRole = {
        user_id: mockUser.id,
        role: mockUser.role,
        is_approved: true,
        approved_at: mockUser.created_at
      };
      
      return {
        data: role,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Create user profile
   */
  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      // Artificial delay
      await this.delay(500);
      
      // Find user in mock data
      const mockUser = mockUsers.find(user => user.id === userId);
      
      if (!mockUser) {
        return {
          data: null,
          error: {
            code: 'auth/user-not-found',
            message: 'User not found'
          },
          success: false
        };
      }
      
      // In a real implementation, this would insert into the database
      // For the mock, we just return a profile object with the provided data
      
      const newProfile: UserProfile = {
        id: userId,
        email: profile.email || mockUser.email,
        full_name: profile.full_name || 
          (mockUser.firstName && mockUser.lastName 
            ? `${mockUser.firstName} ${mockUser.lastName}` 
            : undefined),
        avatar_url: profile.avatar_url || mockUser.avatarUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      
      return {
        data: newProfile,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      // Artificial delay
      await this.delay(500);
      
      // Find user in mock data
      const mockUser = mockUsers.find(user => user.id === userId);
      
      if (!mockUser) {
        return {
          data: null,
          error: {
            code: 'auth/user-not-found',
            message: 'User not found'
          },
          success: false
        };
      }
      
      // In a real implementation, this would update the database
      // For the mock, we just return an updated profile object
      
      const updatedProfile: UserProfile = {
        id: userId,
        email: profile.email || mockUser.email,
        full_name: profile.full_name ||
          (mockUser.firstName && mockUser.lastName
            ? `${mockUser.firstName} ${mockUser.lastName}`
            : undefined),
        avatar_url: profile.avatar_url || mockUser.avatarUrl,
        created_at: mockUser.created_at,
        updated_at: new Date().toISOString(),
        ...profile
      };
      
      return {
        data: updatedProfile,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Assign user role
   */
  async assignUserRole(userId: string, role: UserRoleType, approved = true): Promise<AuthResult<UserRole>> {
    try {
      // Artificial delay
      await this.delay(400);
      
      // Find user in mock data
      const mockUser = mockUsers.find(user => user.id === userId);
      
      if (!mockUser) {
        return {
          data: null,
          error: {
            code: 'auth/user-not-found',
            message: 'User not found'
          },
          success: false
        };
      }
      
      // In a real implementation, this would update the database
      // For the mock, we just return a role object with the new role
      
      const userRole: UserRole = {
        user_id: userId,
        role: role,
        is_approved: approved,
        requested_at: new Date().toISOString(),
        approved_at: approved ? new Date().toISOString() : undefined
      };
      
      return {
        data: userRole,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        success: false
      };
    }
  }
  
  /**
   * Exchange code for session (mock implementation)
   */
  async exchangeCodeForSession(code: string): Promise<AuthResult> {
    try {
      // Artificial delay
      await this.delay(500);
      
      // In a real implementation, this would exchange the code for a session
      // For the mock, we just return success
      
      return {
        data: null,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'auth/exchange-error',
          message: error instanceof Error ? error.message : 'Error exchanging code for session'
        },
        success: false
      };
    }
  }
  
  /**
   * Helper method to simulate network delay
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create a singleton instance of the auth service
 */
export const mockAuthService = new MockAuthService();
