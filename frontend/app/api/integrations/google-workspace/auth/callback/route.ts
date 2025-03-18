import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleOAuthCallback } from '@/lib/integrations/adapters/google-workspace/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle errors returned from Google
    if (error) {
      console.error('Google OAuth error:', error);
      // Redirect to error page or dashboard with error message
      return NextResponse.redirect(new URL('/dashboard/employee?error=google_auth_denied', request.url));
    }
    
    // Ensure code and state are present
    if (!code || !state) {
      console.error('Missing code or state parameter');
      return NextResponse.redirect(new URL('/dashboard/employee?error=google_auth_invalid', request.url));
    }
    
    try {
      // Create a Supabase client
      const supabase = createRouteHandlerClient({ cookies });
      
      // Safely parse the state parameter with detailed error handling
      let userId;
      try {
        // Log the raw state for debugging
        console.log('Raw state parameter:', state);
        
        // Decode base64 state with error handling
        const decodedState = Buffer.from(state, 'base64').toString();
        console.log('Decoded state:', decodedState);
        
        // Parse JSON with error handling
        const parsedState = JSON.parse(decodedState);
        console.log('Parsed state:', parsedState);
        
        // Extract userId with validation
        userId = parsedState.userId;
        
        if (!userId) {
          throw new Error('No userId found in state parameter');
        }
      } catch (parseError) {
        console.error('Error parsing state parameter:', parseError);
        console.error('Original state value:', state);
        return NextResponse.redirect(new URL('/dashboard/employee?error=invalid_state_format', request.url));
      }
      
      // Use getUser instead of getSession for better security
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError.message);
        return NextResponse.redirect(new URL('/auth/login?error=auth_error&message=' + encodeURIComponent(userError.message), request.url));
      }
      
      if (!user) {
        console.error('User not authenticated during Google OAuth callback');
        return NextResponse.redirect(new URL('/auth/login?error=session_expired', request.url));
      }
      
      // Verify that the user ID in the state matches the authenticated user
      if (userId !== user.id) {
        console.error('User ID mismatch during OAuth callback');
        return NextResponse.redirect(new URL('/dashboard/employee?error=auth_user_mismatch', request.url));
      }
      
      // Process the callback with error handling
      try {
        await handleOAuthCallback(code, state);
        console.log('OAuth callback processed successfully for user:', user.id);
      } catch (oauthError: any) {
        console.error('Error processing OAuth callback:', oauthError?.message || oauthError);
        // Still redirect but include error information
        return NextResponse.redirect(new URL(`/dashboard/employee?error=oauth_processing&message=${encodeURIComponent(oauthError?.message || 'Unknown error')}`, request.url));
      }
      
      // Redirect back to the dashboard
      return NextResponse.redirect(new URL('/dashboard/employee?success=google_connected', request.url));
    } catch (callbackError) {
      console.error('Error during Google OAuth callback processing:', callbackError);
      return NextResponse.redirect(new URL('/dashboard/employee?error=google_auth_processing', request.url));
    }
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return NextResponse.redirect(new URL('/dashboard/employee?error=google_auth_failed', request.url));
  }
}
