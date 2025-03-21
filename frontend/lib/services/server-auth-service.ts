/**
 * Server Auth Service Implementation
 * 
 * Server-side authentication service for the Front of House Productions application.
 * This service handles server-side authentication operations, especially the OAuth callback logic.
 */

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { 
  IServerAuthService, 
  AuthProvider, 
  AuthResult, 
  User, 
  UserProfile, 
  UserRole, 
  UserRoleType 
} from '../types/auth';
import { 
  handleAuthError, 
  createErrorResult, 
  createSuccessResult 
} from '../utils/error-handlers';

/**
 * Server-side authentication service implementation.
 * Handles OAuth callback processing and profile/role management.
 */
export class ServerAuthService implements IServerAuthService {
  /**
   * Handles the complete OAuth callback flow:
   * 1. Exchanges the code for a session
   * 2. Gets the authenticated user
   * 3. Ensures the user has a profile
   * 4. Ensures the user has a role
   * 5. Returns the complete user data
   */
  async handleAuthCallback(code: string): Promise<AuthResult<User>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
      // Exchange the code for a session
      console.log('Exchanging code for session...');
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) throw sessionError;
      
      // Get the user
      console.log('Session created successfully, fetching user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        return createErrorResult('no-user', 'No user found after authentication') as AuthResult<User>;
      }
      
      console.log('User retrieved successfully:', {
        id: user.id,
        email: user.email,
        provider: user.app_metadata?.provider
      });
      
      // Ensure profile exists
      console.log('Ensuring user profile exists...');
      const profileResult = await this.ensureUserProfile(user.id, user.email || undefined);
      
      if (!profileResult.success) {
        console.error('Failed to ensure user profile:', profileResult.error);
        return createErrorResult(
          'profile-creation-failed',
          'Failed to create or verify user profile',
          profileResult.error
        ) as AuthResult<User>;
      }
      
      // Ensure role exists
      console.log('Ensuring user role exists...');
      const roleResult = await this.ensureUserRole(user.id);
      
      if (!roleResult.success) {
        console.error('Failed to ensure user role:', roleResult.error);
        return createErrorResult(
          'role-creation-failed',
          'Failed to create or verify user role',
          roleResult.error
        ) as AuthResult<User>;
      }
      
      // Return the complete user data
      return createSuccessResult<User>({
        auth: {
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider as AuthProvider,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata
        },
        profile: profileResult.data || undefined,
        role: roleResult.data || undefined
      });
    } catch (error) {
      return handleAuthError(error, 'auth-callback') as AuthResult<User>;
    }
  }
  
  /**
   * Determines the appropriate redirect URL based on the user's role
   */
  async handleAuthRedirect(user: User): Promise<string> {
    try {
      // Default redirect
      let redirectUrl = '/dashboard/customer';
      
      // If no role information is available, redirect to customer dashboard
      if (!user.role) {
        console.log('No role information available, redirecting to customer dashboard');
        return redirectUrl;
      }
      
      const { role, is_approved } = user.role;
      
      console.log('Determining redirect based on role:', { role, is_approved });
      
      // Redirect based on user role
      if (role === 'manager' && is_approved) {
        redirectUrl = '/dashboard/manager';
      } else if ((role === 'employee' || role === 'manager') && is_approved) {
        redirectUrl = '/dashboard/employee';
      } else if (role === 'customer') {
        // Default to customer portal for customer role
        redirectUrl = '/dashboard/customer';
      } else if (!is_approved) {
        // Show a specific message for unapproved accounts
        redirectUrl = '/auth/login?error=account_pending_approval';
      }
      
      return redirectUrl;
    } catch (error) {
      console.error('Error determining redirect URL:', error);
      // Default to customer dashboard as a fallback
      return '/dashboard/customer';
    }
  }
  
  /**
   * Signs in a user with email and password (server-side)
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult<User>> {
    try {
      const supabase = this.createServerSupabaseClient();
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
      return handleAuthError(error, 'server-sign-in-email') as AuthResult<User>;
    }
  }
  
  /**
   * Server-side OAuth sign-in is not applicable
   * This method is included for interface compatibility
   */
  async signInWithOAuth(provider: AuthProvider): Promise<AuthResult> {
    return createErrorResult(
      'not-supported', 
      'OAuth sign-in is not supported server-side'
    );
  }
  
  /**
   * Signs out the current user (server-side)
   */
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = this.createServerSupabaseClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return createSuccessResult();
    } catch (error) {
      return handleAuthError(error, 'server-sign-out');
    }
  }
  
  /**
   * Gets the current user (server-side)
   */
  async getCurrentUser(): Promise<AuthResult<User>> {
    try {
      const supabase = this.createServerSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (data.user) {
        return await this.enrichUserData(data.user);
      }
      
      return createErrorResult('no-user', 'No authenticated user found') as AuthResult<User>;
    } catch (error) {
      return handleAuthError(error, 'server-get-current-user') as AuthResult<User>;
    }
  }
  
  /**
   * Gets a user's role (server-side)
   */
  async getUserRole(userId: string): Promise<AuthResult<UserRole>> {
    try {
      const supabase = this.createServerSupabaseClient();
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
      return handleAuthError(error, 'server-get-user-role') as AuthResult<UserRole>;
    }
  }
  
  /**
   * Creates a user profile (server-side)
   */
  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
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
      return handleAuthError(error, 'server-create-user-profile') as AuthResult<UserProfile>;
    }
  }
  
  /**
   * Updates a user profile (server-side)
   */
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return createSuccessResult<UserProfile>(data as UserProfile);
    } catch (error) {
      return handleAuthError(error, 'server-update-user-profile') as AuthResult<UserProfile>;
    }
  }
  
  /**
   * Assigns a role to a user (server-side)
   */
  async assignUserRole(userId: string, role: UserRoleType, approved: boolean = true): Promise<AuthResult<UserRole>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
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
      return handleAuthError(error, 'server-assign-user-role') as AuthResult<UserRole>;
    }
  }
  
  /**
   * Exchanges an auth code for a session (server-side)
   */
  async exchangeCodeForSession(code: string): Promise<AuthResult> {
    try {
      const supabase = this.createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) throw error;
      
      return createSuccessResult();
    } catch (error) {
      return handleAuthError(error, 'server-exchange-code-for-session');
    }
  }
  
  /**
   * Ensures a user has a profile, creating one if necessary
   * Implements robust fallback mechanisms for profile creation
   */
  async ensureUserProfile(userId: string, email?: string): Promise<AuthResult<UserProfile>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profileError && profile) {
        console.log('Profile already exists:', profile.email);
        return createSuccessResult<UserProfile>(profile as UserProfile);
      }
      
      // Profile doesn't exist, let's create one with multiple fallback methods
      console.log('No profile found, creating profile...');
      
      // Try RPC function first (most reliable method)
      try {
        console.log('Attempting to ensure profile exists with RPC function...');
        const { data: ensureResult, error: ensureError } = await supabase.rpc(
          'ensure_user_has_profile_and_role',
          { user_uuid: userId }
        );
        
        if (!ensureError && ensureResult === true) {
          console.log('Profile successfully created via RPC function');
          
          // Verify profile creation
          const { data: verifiedProfile, error: verifyError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (!verifyError && verifiedProfile) {
            return createSuccessResult<UserProfile>(verifiedProfile as UserProfile);
          }
        } else {
          console.error('Error using ensure_user_has_profile_and_role:', ensureError?.message);
        }
      } catch (rpcError) {
        console.error('Exception in RPC call:', rpcError);
      }
      
      // Try emergency function as fallback
      try {
        console.log('Trying emergency_create_profile as fallback...');
        const { data: emergencyResult, error: emergencyError } = await supabase.rpc(
          'emergency_create_profile',
          { user_uuid: userId }
        );
        
        if (!emergencyError && emergencyResult === true) {
          console.log('Profile successfully created via emergency function');
          
          // Verify profile creation
          const { data: verifiedProfile, error: verifyError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (!verifyError && verifiedProfile) {
            return createSuccessResult<UserProfile>(verifiedProfile as UserProfile);
          }
        } else {
          console.error('Error using emergency_create_profile:', emergencyError?.message);
        }
      } catch (emergencyError) {
        console.error('Exception in emergency function:', emergencyError);
      }
      
      // Final fallback: direct insert
      console.log('Attempting direct profile creation as last resort...');
      
      // Prepare email with fallback
      let validEmail = email;
      
      if (!validEmail || validEmail.trim() === '') {
        console.log('Email is missing or empty, using placeholder');
        validEmail = `user_${userId}@placeholder.com`;
      }
      
      // Get user data for additional profile info
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      // Create profile with direct insert
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: validEmail,
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error in direct profile creation:', insertError.message);
        
        // Try fix_user_with_missing_email as last attempt
        try {
          console.log('Attempting to fix missing email with fix_user_with_missing_email...');
          const { data: fixResult, error: fixError } = await supabase.rpc(
            'fix_user_with_missing_email',
            { user_uuid: userId }
          );
          
          if (!fixError && fixResult === true) {
            console.log('Successfully fixed user email');
            
            // Verify profile creation
            const { data: verifiedProfile, error: verifyError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (!verifyError && verifiedProfile) {
              return createSuccessResult<UserProfile>(verifiedProfile as UserProfile);
            }
          } else {
            console.error('Error fixing email:', fixError?.message);
          }
        } catch (fixError) {
          console.error('Exception fixing email:', fixError);
        }
        
        return createErrorResult('profile-creation-failed', 'Failed to create user profile after multiple attempts') as AuthResult<UserProfile>;
      }
      
      return createSuccessResult<UserProfile>(insertedProfile as UserProfile);
    } catch (error) {
      return handleAuthError(error, 'ensure-user-profile') as AuthResult<UserProfile>;
    }
  }
  
  /**
   * Ensures a user has a role, creating one if necessary
   */
  async ensureUserRole(userId: string, role?: UserRoleType): Promise<AuthResult<UserRole>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
      // Check if role exists
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!roleError && userRole) {
        console.log('User role already exists:', userRole.role);
        return createSuccessResult<UserRole>(userRole as UserRole);
      }
      
      // Role doesn't exist, create one
      console.log('No user role found, creating role...');
      
      // Default role is customer unless otherwise specified
      const roleType = role || 'customer';
      
      // Create the role
      const { data: createdRole, error: createError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: roleType,
          is_approved: roleType === 'customer', // Auto-approve customers, not employees/managers
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user role:', createError.message);
        
        // Try using RPC function as fallback
        try {
          console.log('Attempting to create role with RPC function...');
          const { data: rpcResult, error: rpcError } = await supabase.rpc(
            'ensure_user_has_profile_and_role',
            { user_uuid: userId }
          );
          
          if (!rpcError && rpcResult === true) {
            console.log('Role created via RPC function');
            
            // Verify role creation
            const { data: verifiedRole, error: verifyError } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', userId)
              .single();
            
            if (!verifyError && verifiedRole) {
              return createSuccessResult<UserRole>(verifiedRole as UserRole);
            }
          } else {
            console.error('Error in RPC role creation:', rpcError?.message);
          }
        } catch (rpcError) {
          console.error('Exception in RPC role creation:', rpcError);
        }
        
        return createErrorResult('role-creation-failed', 'Failed to create user role') as AuthResult<UserRole>;
      }
      
      return createSuccessResult<UserRole>(createdRole as UserRole);
    } catch (error) {
      return handleAuthError(error, 'ensure-user-role') as AuthResult<UserRole>;
    }
  }
  
  /**
   * Helper to enrich user data with profile and role information
   */
  private async enrichUserData(authUser: any): Promise<AuthResult<User>> {
    try {
      const supabase = this.createServerSupabaseClient();
      
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
        provider: authUser.app_metadata?.provider as AuthProvider,
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata
        },
        profile: profile || undefined,
        role: role || undefined
      });
    } catch (error) {
      return handleAuthError(error, 'server-enrich-user-data') as AuthResult<User>;
    }
  }
  
  /**
   * Helper to create a server-side Supabase client
   */
  private createServerSupabaseClient() {
    // Use cookies() function directly instead of storing it
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookies().set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookies().set({ name, value: '', ...options });
          },
        },
      }
    );
  }
}

// Export singleton instance
export const serverAuthService = new ServerAuthService();
