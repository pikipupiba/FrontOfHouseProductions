/**
 * Auth Service Implementation
 * 
 * Client-side authentication service for the Front of House Productions application.
 * This service centralizes all authentication logic and provides a consistent API
 * for authentication operations.
 */

import { createClient } from '@/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';
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
import { 
  handleAuthError, 
  createErrorResult, 
  createSuccessResult 
} from '../utils/error-handlers';

/**
 * Client-side authentication service implementation.
 * Handles all client-side auth operations and provides consistent error handling.
 */
export class AuthService implements IAuthService {
  /**
   * Signs in a user with email and password
   */
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
      
      return createSuccessResult<User>(null);
    } catch (error) {
      return handleAuthError(error, 'sign-in-email') as AuthResult<User>;
    }
  }
  
  /**
   * Signs in a user with an OAuth provider (e.g., Google)
   */
  async signInWithOAuth(provider: AuthProvider): Promise<AuthResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      return createSuccessResult(null);
    } catch (error) {
      return handleAuthError(error, 'sign-in-oauth');
    }
  }
  
  /**
   * Signs out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return createSuccessResult();
    } catch (error) {
      return handleAuthError(error, 'sign-out');
    }
  }
  
  /**
   * Retrieves the current authenticated user with profile and role data
   */
  async getCurrentUser(): Promise<AuthResult<User>> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (data.user) {
        return await this.enrichUserData(data.user);
      }
      
      return createErrorResult('no-user', 'No authenticated user found') as AuthResult<User>;
    } catch (error) {
      return handleAuthError(error, 'get-current-user') as AuthResult<User>;
    }
  }
  
  /**
   * Gets the role for a specific user
   */
  async getUserRole(userId: string): Promise<AuthResult<UserRole>> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No data returned
          return createErrorResult('no-role', 'User role not found') as AuthResult<UserRole>;
        }
        throw error;
      }
      
      return createSuccessResult<UserRole>(data as UserRole);
    } catch (error) {
      return handleAuthError(error, 'get-user-role') as AuthResult<UserRole>;
    }
  }
  
  /**
   * Creates a user profile for a given user ID
   */
  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      const supabase = createClient();
      
      // Ensure ID is set
      const profileData = {
        id: userId,
        ...profile
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (error) throw error;
      
      return createSuccessResult<UserProfile>(data as UserProfile);
    } catch (error) {
      return handleAuthError(error, 'create-user-profile') as AuthResult<UserProfile>;
    }
  }
  
  /**
   * Updates a user profile for a given user ID
   */
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return createSuccessResult<UserProfile>(data as UserProfile);
    } catch (error) {
      return handleAuthError(error, 'update-user-profile') as AuthResult<UserProfile>;
    }
  }
  
  /**
   * Assigns a role to a user
   */
  async assignUserRole(userId: string, role: UserRoleType, approved: boolean = true): Promise<AuthResult<UserRole>> {
    try {
      const supabase = createClient();
      
      const roleData = {
        user_id: userId,
        role,
        is_approved: approved,
      };
      
      const { data, error } = await supabase
        .from('user_roles')
        .upsert(roleData)
        .select()
        .single();
      
      if (error) throw error;
      
      return createSuccessResult<UserRole>(data as UserRole);
    } catch (error) {
      return handleAuthError(error, 'assign-user-role') as AuthResult<UserRole>;
    }
  }
  
  /**
   * Exchanges an auth code for a session
   * Note: This is primarily used server-side, but included here for completeness
   */
  async exchangeCodeForSession(code: string): Promise<AuthResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) throw error;
      
      return createSuccessResult();
    } catch (error) {
      return handleAuthError(error, 'exchange-code-for-session');
    }
  }
  
  /**
   * Helper method to enrich a user with profile and role data
   */
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
      
      return createSuccessResult<User>({
        auth: {
          id: authUser.id,
          email: authUser.email,
          provider: authUser.app_metadata?.provider,
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata
        },
        profile: profile || undefined,
        role: role || undefined
      });
    } catch (error) {
      return handleAuthError(error, 'enrich-user-data') as AuthResult<User>;
    }
  }
}

// Create a singleton instance for client-side usage
export const authService = new AuthService();
