/**
 * Error Handling Utilities
 * 
 * Centralized error handling for authentication operations in the
 * Front of House Productions application.
 */

import { AuthError, AuthResult } from '../types/auth';

/**
 * Standardized error handling for authentication operations.
 * 
 * @param error The error that occurred
 * @param operation A string identifier for the operation where the error occurred
 * @returns A standardized AuthResult with error information
 */
export function handleAuthError(error: any, operation: string): AuthResult {
  console.error(`Auth error in ${operation}:`, error);
  
  // Extract relevant error information
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

/**
 * Maps technical error codes to user-friendly error messages.
 * 
 * @param error The AuthError object
 * @returns A user-friendly error message
 */
export function mapErrorToUserMessage(error: AuthError): string {
  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    // Supabase auth errors
    'auth/invalid-email': 'The email address is not valid',
    'auth/user-disabled': 'This user account has been disabled',
    'auth/user-not-found': 'No account exists with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many sign-in attempts. Please try again later',
    'auth/email-already-in-use': 'An account with this email already exists',
    
    // Custom application errors
    'no-user': 'No user is currently signed in',
    'profile-creation-failed': 'Failed to create your user profile',
    'role-creation-failed': 'Failed to set up your account permissions',
    'missing-auth-code': 'Authentication failed: Missing authorization code',
    'session-exchange-failed': 'Authentication failed: Unable to complete sign-in',
    'provider-error': 'Authentication provider returned an error',
    'account-pending-approval': 'Your account is pending approval',
    
    // Profile and role management errors
    'no-profile': 'Your user profile could not be found',
    'no-role': 'Your account permissions are not set up',
    
    // Google-specific errors
    'google-auth-error': 'Error signing in with Google',
    'google-profile-error': 'Unable to retrieve profile information from Google',
    
    // Server errors
    'server-error': 'A server error occurred. Please try again later',
    'database-error': 'A database error occurred. Please try again later',
  };
  
  // Return the mapped message or fall back to the original message
  return errorMessages[error.code] || error.message;
}

/**
 * Creates an error result with a specific error code and message.
 * 
 * @param code The error code
 * @param message The error message
 * @param details Additional error details (optional)
 * @returns A standardized AuthResult with the specified error
 */
export function createErrorResult(code: string, message: string, details?: any): AuthResult {
  return {
    data: null,
    error: {
      code,
      message,
      details
    },
    success: false
  };
}

/**
 * Creates a success result with optional data.
 * 
 * @param data The data to include in the result
 * @returns A standardized AuthResult indicating success
 */
export function createSuccessResult<T>(data: T | null = null): AuthResult<T> {
  return {
    data,
    error: null,
    success: true
  };
}
