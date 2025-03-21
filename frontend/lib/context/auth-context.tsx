'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResult, User, UserProfile, UserRole, UserRoleType } from '@/lib/types/auth';
import { mockAuthService } from '@/lib/mock/services/mock-auth-service';

/**
 * Auth context types
 */
interface AuthContextType {
  // State
  user: User | null;
  loading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<AuthResult<User>>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  
  // Profile methods
  updateProfile: (userId: string, profile: Partial<UserProfile>) => Promise<AuthResult<UserProfile>>;
  
  // Role methods
  assignRole: (userId: string, role: UserRoleType, approved?: boolean) => Promise<AuthResult<UserRole>>;
}

// Create auth context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Auth context provider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize: check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Use mock auth service
        const { data, error } = await mockAuthService.getCurrentUser();
        
        if (error) {
          console.error('Error fetching current user:', error);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error('Unexpected error in auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<AuthResult<User>> => {
    try {
      setLoading(true);
      
      // Use mock auth service
      const result = await mockAuthService.signInWithEmail(email, password);
      
      if (result.success && result.data) {
        setUser(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      return {
        data: null,
        error: {
          code: 'auth/unknown',
          message: error instanceof Error ? error.message : 'An unknown error occurred during sign in'
        },
        success: false
      };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Use mock auth service
      const result = await mockAuthService.signInWithOAuth('google');
      
      // In a real implementation, this would redirect to Google auth
      // For the mock, we'll simulate a successful login and fetch the user
      if (result.success) {
        // In mock implementation we need to manually fetch the user after OAuth
        const userResult = await mockAuthService.getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      return {
        data: null,
        error: {
          code: 'auth/google-error',
          message: error instanceof Error ? error.message : 'Error signing in with Google'
        },
        success: false
      };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Sign out
   */
  const signOut = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Use mock auth service
      const result = await mockAuthService.signOut();
      
      if (result.success) {
        setUser(null);
      }
      
      return result;
    } catch (error) {
      console.error('Error in signOut:', error);
      return {
        data: null,
        error: {
          code: 'auth/signout-error',
          message: error instanceof Error ? error.message : 'Error signing out'
        },
        success: false
      };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update user profile
   */
  const updateProfile = async (userId: string, profile: Partial<UserProfile>): Promise<AuthResult<UserProfile>> => {
    try {
      // Use mock auth service
      const result = await mockAuthService.updateUserProfile(userId, profile);
      
      // If successful and updating the current user, refresh user data
      if (result.success && user?.auth.id === userId) {
        const userResult = await mockAuthService.getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return {
        data: null,
        error: {
          code: 'auth/profile-update-error',
          message: error instanceof Error ? error.message : 'Error updating profile'
        },
        success: false
      };
    }
  };
  
  /**
   * Assign role to user
   */
  const assignRole = async (userId: string, role: UserRoleType, approved = true): Promise<AuthResult<UserRole>> => {
    try {
      // Use mock auth service
      const result = await mockAuthService.assignUserRole(userId, role, approved);
      
      // If successful and updating the current user, refresh user data
      if (result.success && user?.auth.id === userId) {
        const userResult = await mockAuthService.getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in assignRole:', error);
      return {
        data: null,
        error: {
          code: 'auth/role-assignment-error',
          message: error instanceof Error ? error.message : 'Error assigning role'
        },
        success: false
      };
    }
  };
  
  // Context value
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    assignRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
