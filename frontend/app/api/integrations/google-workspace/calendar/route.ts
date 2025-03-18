import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Simplified placeholder route that returns a service temporarily unavailable response
export async function GET(request: NextRequest) {
  try {
    // Still do user authentication to maintain security
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
        { error: 'Unauthorized. You must be logged in to access calendar events.' },
        { status: 401 }
      );
    }
    
    // Instead of actual logic, return a service temporarily unavailable response
    return NextResponse.json(
      { 
        error: 'Calendar service temporarily unavailable',
        message: 'The Calendar integration is currently being improved for reliability. Please use the Google Drive integration in the meantime.' 
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('Error in calendar API route:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST route also returns service unavailable
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Calendar service temporarily unavailable',
      message: 'The Calendar integration is currently being improved for reliability. Please use the Google Drive integration in the meantime.' 
    },
    { status: 503 }
  );
}
