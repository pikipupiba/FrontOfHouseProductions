import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateAuthUrl, checkExistingGoogleAuth, hasValidCredentials, disconnectGoogleWorkspace } from '@/lib/integrations/adapters/google-workspace/auth';

// POST handler to initiate OAuth flow
export async function POST(request: NextRequest) {
  try {
    // Get the user using the recommended pattern
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to connect to Google Workspace.' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // First check if the user already has Google credentials from their sign-in
    const existingCredentials = await checkExistingGoogleAuth(userId);
    
    if (existingCredentials) {
      // User already has Google credentials, no need for a new OAuth flow
      return NextResponse.json({ 
        success: true, 
        message: 'Reused existing Google authentication credentials',
        skipRedirect: true
      });
    }
    
    // No existing credentials found, generate new authorization URL
    const authUrl = await generateAuthUrl(userId);
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Google Workspace auth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google Workspace authentication' },
      { status: 500 }
    );
  }
}

// GET handler to check authentication status
export async function GET(request: NextRequest) {
  try {
    // Get the user using the recommended pattern
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to check Google Workspace status.' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Check if user has valid credentials or if we can use existing Google auth
    const hasCredentials = await hasValidCredentials(userId);
    
    if (!hasCredentials) {
      // Try to reuse existing Google auth if available
      const existingCredentials = await checkExistingGoogleAuth(userId);
      
      return NextResponse.json({
        isConnected: hasCredentials || !!existingCredentials,
        usedExistingAuth: !hasCredentials && !!existingCredentials
      });
    }
    
    return NextResponse.json({
      isConnected: true,
      usedExistingAuth: false
    });
  } catch (error) {
    console.error('Error checking Google Workspace auth status:', error);
    return NextResponse.json(
      { error: 'Failed to check Google Workspace authentication status' },
      { status: 500 }
    );
  }
}

// DELETE handler to disconnect Google Workspace
export async function DELETE(request: NextRequest) {
  try {
    // Get the user using the recommended pattern
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to disconnect from Google Workspace.' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Disconnect from Google Workspace
    await disconnectGoogleWorkspace(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Google Workspace disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Google Workspace:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Google Workspace' },
      { status: 500 }
    );
  }
}
