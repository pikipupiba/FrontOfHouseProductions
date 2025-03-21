import { NextRequest, NextResponse } from 'next/server';
import { serverAuthService } from '@/lib/services/server-auth-service';
import { mapErrorToUserMessage } from '@/lib/utils/error-handlers';

/**
 * Auth Callback Route
 * 
 * This route handles the OAuth callback from authentication providers.
 * It processes the authentication code, ensures user profile and role exist,
 * and redirects the user to the appropriate dashboard based on their role.
 */
export async function GET(request: NextRequest) {
  // Get the code and error parameters from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');
  
  // Log the request for debugging
  console.log('Auth callback request:', {
    url: request.url,
    code: code ? 'present' : 'missing',
    error: errorParam,
    errorDesc
  });
  
  // Handle error redirects from OAuth provider
  if (errorParam) {
    console.error('Auth provider returned an error:', {
      error: errorParam,
      description: errorDesc
    });
    
    return NextResponse.redirect(
      new URL(`/auth/login?error=provider_${errorParam}&desc=${encodeURIComponent(errorDesc || '')}`, request.url)
    );
  }
  
  // Check if code is present
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_auth_code', request.url)
    );
  }
  
  try {
    // Use the server auth service to handle the OAuth callback
    const result = await serverAuthService.handleAuthCallback(code);
    
    // If authentication failed, redirect to login with error
    if (!result.success || !result.data) {
      console.error('Auth callback failed:', result.error);
      
      const errorCode = result.error?.code || 'unknown';
      const errorMessage = mapErrorToUserMessage(result.error || { 
        code: errorCode, 
        message: 'Unknown error' 
      });
      
      return NextResponse.redirect(
        new URL(`/auth/login?error=${errorCode}&message=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }
    
    // Determine the redirect URL based on the user's role
    const redirectUrl = await serverAuthService.handleAuthRedirect(result.data);
    
    // Redirect to the appropriate dashboard
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Unexpected error in auth callback:', error);
    
    const errorMessage = error?.message || 'An unexpected error occurred';
    return NextResponse.redirect(
      new URL(`/auth/login?error=auth_callback_error&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
