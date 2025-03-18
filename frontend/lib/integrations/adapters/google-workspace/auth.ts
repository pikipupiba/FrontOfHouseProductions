import { OAuth2Client } from 'google-auth-library';
import { getIntegrationManager } from '../../../integrations/core/integrationmanager';
import { ServiceCredentials } from '../../../integrations/core/types';
import { createClient } from '@/lib/supabase/client';

// OAuth configuration
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/tasks',
];

// Check if user has already authenticated with Google via Supabase Auth
export async function checkExistingGoogleAuth(userId: string): Promise<ServiceCredentials | null> {
  try {
    // Get the Supabase client
    const supabase = createClient();
    
    // Check if user exists in the database
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Error getting user:', error);
      return null;
    }
    
      // Check if the user signed in with Google
      if (user.user?.app_metadata?.provider === 'google') {
        try {
          // Get the existing OAuth credentials from the database
          const { data: credentials, error: credError } = await supabase
            .from('integration_cache.oauth_credentials')
            .select('credentials')
            .eq('service_name', 'google-workspace')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (credentials) {
            return credentials.credentials as ServiceCredentials;
          }
          
          // Note: We no longer attempt to automatically create credentials from auth provider
          // This is because the tokens available through Supabase auth don't have the same
          // scopes as the ones we need for our Google Workspace integration
          
          // Return null to indicate we need explicit authorization for Google Workspace
          return null;
        } catch (error) {
          console.error('Error accessing OAuth credentials:', error);
          return null;
        }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking existing Google auth:', error);
    return null;
  }
}

// Generate the OAuth URL for the Google sign-in flow
export async function generateAuthUrl(userId: string): Promise<string> {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/integrations/google-workspace/auth/callback`
  );
  
  // Create a state parameter with the user ID to identify the user when the callback comes back
  const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
  
  // Generate the auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',        // Will return a refresh token
    scope: SCOPES,
    prompt: 'consent',             // Forces the consent screen to appear every time
    state                          // Pass the state parameter for security
  });
  
  return authUrl;
}

// Handle the OAuth callback from Google
export async function handleOAuthCallback(code: string, state: string): Promise<void> {
  // Decode the state parameter to get the user ID
  const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());
  
  // Create OAuth client
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/integrations/google-workspace/auth/callback`
  );
  
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Create credential object
    const credentials: ServiceCredentials = {
      type: 'oauth',
      userId,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/integrations/google-workspace/auth/callback`,
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : undefined
    };
    
    // Store the credentials in the integration manager
    const integrationManager = getIntegrationManager();
    await integrationManager.updateCredentials('google-workspace', credentials);
    
    console.log(`Successfully authenticated Google Workspace for user ${userId}`);
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    throw error;
  }
}

// Check if a user has valid Google Workspace credentials
export async function hasValidCredentials(userId: string): Promise<boolean> {
  const integrationManager = getIntegrationManager();
  
  try {
    // Get adapter and check auth status
    if (!integrationManager.hasAdapter('google-workspace')) {
      // No adapter registered
      return false;
    }
    
    const adapter = integrationManager.getAdapter('google-workspace');
    const authStatus = await adapter.checkAuthStatus();
    
    return authStatus.isAuthenticated;
  } catch (error) {
    console.error('Error checking credentials:', error);
    return false;
  }
}

// Disconnect Google Workspace
export async function disconnectGoogleWorkspace(userId: string): Promise<void> {
  const integrationManager = getIntegrationManager();
  
  try {
    // Remove credentials
    await integrationManager.removeCredentials('google-workspace');
    console.log(`Successfully disconnected Google Workspace for user ${userId}`);
  } catch (error) {
    console.error('Error disconnecting Google Workspace:', error);
    throw error;
  }
}
