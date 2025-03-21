/**
 * Authentication Type Definitions
 * 
 * This file contains all TypeScript interfaces and types related to authentication
 * in the Front of House Productions application.
 */

// User-related types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  role?: string; // Role information might be stored in the profile
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
  
  // Session management
  exchangeCodeForSession(code: string): Promise<AuthResult>;
}

// Server-side auth service interface extends the base auth service
export interface IServerAuthService extends IAuthService {
  // Additional server-side methods
  handleAuthCallback(code: string): Promise<AuthResult<User>>;
  handleAuthRedirect(user: User): Promise<string>; // Returns redirect URL
  ensureUserProfile(userId: string, email?: string): Promise<AuthResult<UserProfile>>;
  ensureUserRole(userId: string, role?: UserRoleType): Promise<AuthResult<UserRole>>;
}
