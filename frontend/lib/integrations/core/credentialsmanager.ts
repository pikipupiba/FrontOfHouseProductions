import { createClient } from '@supabase/supabase-js';
import { IntegrationError, IntegrationErrorType } from './types';
import type { ServiceCredentials } from './types';

// Assuming we have environment variables set up for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key
// Note: This should only be used in secure server-side contexts
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Manages secure storage and retrieval of service credentials
 * Handles encryption, OAuth token refresh, and credential rotation
 */
export class CredentialsManager {
  private static instance: CredentialsManager;
  private cache: Map<string, ServiceCredentials> = new Map();
  
  private constructor() {}
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): CredentialsManager {
    if (!CredentialsManager.instance) {
      CredentialsManager.instance = new CredentialsManager();
    }
    return CredentialsManager.instance;
  }
  
  /**
   * Store credentials for a service
   * @param serviceName Name of the service
   * @param credentials Service credentials
   */
  async storeCredentials(
    serviceName: string, 
    credentials: ServiceCredentials
  ): Promise<void> {
    // Store in the memory cache
    this.cache.set(serviceName, credentials);
    
    // Check if we have Supabase connection
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase connection info missing, credentials only stored in memory');
      return;
    }
    
    try {
      // Store in Supabase with encryption
      const { error } = await supabaseAdmin
        .from('integration_credentials')
        .upsert({
          service_name: serviceName,
          credentials: this.encrypt(JSON.stringify(credentials)),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        throw new Error(`Failed to store credentials: ${error.message}`);
      }
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw new IntegrationError({
        type: IntegrationErrorType.UNKNOWN,
        message: `Failed to store credentials for ${serviceName}: ${(error as Error).message}`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
  }
  
  /**
   * Get credentials for a service
   * @param serviceName Name of the service
   * @returns Service credentials
   */
  async getCredentials(serviceName: string): Promise<ServiceCredentials> {
    // Check memory cache first
    const cachedCreds = this.cache.get(serviceName);
    if (cachedCreds) {
      return cachedCreds;
    }
    
    // Try environment variables (for development)
    const envCreds = this.getCredentialsFromEnv(serviceName);
    if (envCreds) {
      // Cache for future use
      this.cache.set(serviceName, envCreds);
      return envCreds;
    }
    
    // If no Supabase connection, we can't retrieve from database
    if (!supabaseUrl || !supabaseKey) {
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `No credentials available for ${serviceName}`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
    
    try {
      // Retrieve from Supabase
      const { data, error } = await supabaseAdmin
        .from('integration_credentials')
        .select('credentials')
        .eq('service_name', serviceName)
        .single();
        
      if (error) {
        throw new Error(`Failed to retrieve credentials: ${error.message}`);
      }
      
      if (!data) {
        throw new Error(`No credentials found for ${serviceName}`);
      }
      
      // Decrypt and parse
      const credentials = JSON.parse(this.decrypt(data.credentials)) as ServiceCredentials;
      
      // Cache for future use
      this.cache.set(serviceName, credentials);
      
      return credentials;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Failed to retrieve credentials for ${serviceName}: ${(error as Error).message}`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
  }
  
  /**
   * Check if valid credentials exist for a service
   * @param serviceName Name of the service
   */
  async hasValidCredentials(serviceName: string): Promise<boolean> {
    try {
      const creds = await this.getCredentials(serviceName);
      
      // For OAuth credentials, check if they're expired
      if (creds.type === 'oauth' && creds.expires_at) {
        const expiresAt = new Date(creds.expires_at);
        // Add a buffer of 5 minutes to account for clock skew
        const bufferMs = 5 * 60 * 1000;
        if (expiresAt.getTime() - bufferMs < Date.now()) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Refresh OAuth token for a service
   * @param serviceName Name of the service
   * @returns Updated service credentials
   */
  async refreshOAuthToken(serviceName: string): Promise<ServiceCredentials> {
    const creds = await this.getCredentials(serviceName);
    
    if (creds.type !== 'oauth' || !creds.refresh_token) {
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Cannot refresh token for ${serviceName}: No refresh token available`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
    
    // Implementation note: The actual refresh implementation will depend on the specific service
    // This is a simplified example to show the structure
    try {
      // Example fetch call - would need to be customized per service
      const response = await fetch(`https://oauth.${serviceName}.com/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: creds.refresh_token,
          client_id: creds.client_id,
          client_secret: creds.client_secret
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }
      
      const tokenData = await response.json();
      
      // Update credentials with new tokens
      const updatedCreds: ServiceCredentials = {
        ...creds,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || creds.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()
      };
      
      // Store updated credentials
      await this.storeCredentials(serviceName, updatedCreds);
      
      return updatedCreds;
    } catch (error) {
      console.error('Error refreshing OAuth token:', error);
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Failed to refresh OAuth token for ${serviceName}: ${(error as Error).message}`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
  }
  
  /**
   * Delete credentials for a service
   * @param serviceName Name of the service
   */
  async deleteCredentials(serviceName: string): Promise<void> {
    // Remove from memory cache
    this.cache.delete(serviceName);
    
    // Check if we have Supabase connection
    if (!supabaseUrl || !supabaseKey) {
      return;
    }
    
    try {
      // Remove from Supabase
      const { error } = await supabaseAdmin
        .from('integration_credentials')
        .delete()
        .eq('service_name', serviceName);
        
      if (error) {
        throw new Error(`Failed to delete credentials: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting credentials:', error);
      throw new IntegrationError({
        type: IntegrationErrorType.UNKNOWN,
        message: `Failed to delete credentials for ${serviceName}: ${(error as Error).message}`,
        serviceName: 'credentials-manager',
        retryable: false
      });
    }
  }
  
  /**
   * Generate a URL for OAuth authorization
   * @param serviceName Name of the service
   * @param options OAuth configuration options
   */
  generateOAuthUrl(
    serviceName: string, 
    options: {
      clientId: string;
      redirectUri: string;
      scope: string[];
      state?: string;
    }
  ): string {
    const { clientId, redirectUri, scope, state = Math.random().toString(36).substring(2) } = options;
    
    // The URL format will depend on the service
    // This is a generic example based on OAuth 2.0
    const url = new URL(`https://oauth.${serviceName}.com/authorize`);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', scope.join(' '));
    url.searchParams.append('state', state);
    url.searchParams.append('response_type', 'code');
    
    return url.toString();
  }
  
  /**
   * Extract credentials from environment variables
   * @param serviceName Name of the service
   * @returns Service credentials or null if not found
   */
  private getCredentialsFromEnv(serviceName: string): ServiceCredentials | null {
    // Format service name for env vars (e.g., current-rms → CURRENT_RMS)
    const prefix = serviceName.replace(/-/g, '_').toUpperCase();
    
    // Check for API key credentials
    const apiKey = process.env[`${prefix}_API_KEY`];
    if (apiKey) {
      return { 
        type: 'api_key', 
        api_key: apiKey,
        subdomain: process.env[`${prefix}_SUBDOMAIN`]
      };
    }
    
    // Check for OAuth credentials
    const clientId = process.env[`${prefix}_CLIENT_ID`];
    const clientSecret = process.env[`${prefix}_CLIENT_SECRET`];
    const refreshToken = process.env[`${prefix}_REFRESH_TOKEN`];
    
    if (clientId && clientSecret && refreshToken) {
      return { 
        type: 'oauth',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      };
    }
    
    // Check for basic auth credentials
    const username = process.env[`${prefix}_USERNAME`];
    const password = process.env[`${prefix}_PASSWORD`];
    
    if (username && password) {
      return {
        type: 'basic',
        username,
        password
      };
    }
    
    return null;
  }
  
  /**
   * Encrypt sensitive data
   * @param data Data to encrypt
   * @returns Encrypted data
   */
  private encrypt(data: string): string {
    // IMPORTANT: In a production system, use a proper encryption library
    // This is just a placeholder to show the structure
    // DO NOT use this in production! It's not actually encrypting anything!
    
    // Simple Base64 encoding as placeholder
    // In a real implementation, use a library like crypto-js or node's crypto module
    return Buffer.from(data).toString('base64');
  }
  
  /**
   * Decrypt sensitive data
   * @param data Data to decrypt
   * @returns Decrypted data
   */
  private decrypt(data: string): string {
    // IMPORTANT: In a production system, use a proper decryption library
    // This is just a placeholder to show the structure
    // DO NOT use this in production! It's not actually decrypting anything!
    
    // Simple Base64 decoding as placeholder
    // In a real implementation, use a library like crypto-js or node's crypto module
    return Buffer.from(data, 'base64').toString();
  }
}

/**
 * Get the singleton credentials manager instance
 */
export function getCredentialsManager(): CredentialsManager {
  return CredentialsManager.getInstance();
}
