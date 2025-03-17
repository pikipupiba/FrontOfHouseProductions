import { BaseAdapter } from './baseadapter';
import { CredentialsManager, getCredentialsManager } from './credentialsmanager';
import { SyncJob } from './syncjob';
import { IntegrationError, IntegrationErrorType } from './types';
import type { 
  IntegrationStatus, 
  JobResult, 
  ServiceCredentials, 
  SyncOptions, 
  SyncResult 
} from './types';

/**
 * Central coordination service for all integrations.
 * Manages adapters, credentials, and synchronization jobs.
 */
export class IntegrationManager {
  private static instance: IntegrationManager;
  private adapters: Map<string, BaseAdapter> = new Map();
  private credentialsManager: CredentialsManager;
  private activeJobs: Map<string, SyncJob> = new Map();
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.credentialsManager = getCredentialsManager();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }
  
  /**
   * Register an adapter for a specific service
   * @param adapter The adapter instance to register
   */
  public registerAdapter(adapter: BaseAdapter): void {
    const serviceName = adapter.getServiceName();
    
    if (this.adapters.has(serviceName)) {
      console.warn(`Replacing existing adapter for ${serviceName}`);
    }
    
    this.adapters.set(serviceName, adapter);
    console.log(`Registered adapter for ${serviceName}`);
  }
  
  /**
   * Get an adapter for a specific service
   * @param serviceName Name of the service
   * @returns The adapter instance
   */
  public getAdapter<T extends BaseAdapter>(serviceName: string): T {
    const adapter = this.adapters.get(serviceName);
    if (!adapter) {
      throw new IntegrationError({
        type: IntegrationErrorType.NOT_FOUND,
        message: `Adapter for service ${serviceName} not found`,
        serviceName: 'integration-manager',
        retryable: false
      });
    }
    return adapter as T;
  }
  
  /**
   * Check if an adapter is registered for a service
   * @param serviceName Name of the service
   */
  public hasAdapter(serviceName: string): boolean {
    return this.adapters.has(serviceName);
  }
  
  /**
   * Get a list of all registered service names
   */
  public getRegisteredServices(): string[] {
    return Array.from(this.adapters.keys());
  }
  
  /**
   * Initialize an adapter with credentials and connect to the service
   * @param serviceName Name of the service
   */
  public async initializeAdapter(serviceName: string): Promise<void> {
    const adapter = this.getAdapter(serviceName);
    
    try {
      // Check if we have valid credentials
      if (await this.credentialsManager.hasValidCredentials(serviceName)) {
        const credentials = await this.credentialsManager.getCredentials(serviceName);
        adapter.setCredentials(credentials);
        
        // Authenticate with the service
        await adapter.authenticate();
      } else {
        console.warn(`No valid credentials for ${serviceName}`);
      }
    } catch (error) {
      console.error(`Failed to initialize adapter for ${serviceName}:`, error);
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Failed to initialize adapter for ${serviceName}: ${(error as Error).message}`,
        serviceName,
        retryable: false,
        originalError: error
      });
    }
  }
  
  /**
   * Update or set credentials for a service
   * @param serviceName Name of the service
   * @param credentials Service credentials
   */
  public async updateCredentials(
    serviceName: string, 
    credentials: ServiceCredentials
  ): Promise<void> {
    await this.credentialsManager.storeCredentials(serviceName, credentials);
    
    // If adapter exists, update it with new credentials
    if (this.hasAdapter(serviceName)) {
      const adapter = this.getAdapter(serviceName);
      adapter.setCredentials(credentials);
    }
  }
  
  /**
   * Remove credentials for a service
   * @param serviceName Name of the service
   */
  public async removeCredentials(serviceName: string): Promise<void> {
    await this.credentialsManager.deleteCredentials(serviceName);
  }
  
  /**
   * Schedule a sync job
   * @param serviceName Name of the service
   * @param resourceType Type of resource to sync
   * @param options Sync options
   * @returns Job result
   */
  public async scheduleSync(
    serviceName: string, 
    resourceType: string, 
    options?: SyncOptions
  ): Promise<JobResult> {
    const adapter = this.getAdapter(serviceName);
    
    // Create a new sync job
    const syncJob = new SyncJob(adapter, resourceType, options);
    const jobId = syncJob.getJobId();
    
    // Store in active jobs
    this.activeJobs.set(jobId, syncJob);
    
    // Register cleanup on completion
    syncJob.onComplete(() => {
      this.activeJobs.delete(jobId);
    }).onError(() => {
      this.activeJobs.delete(jobId);
    });
    
    try {
      // Start the job
      const result = await syncJob.start();
      
      return {
        jobId,
        status: 'completed',
        result
      };
    } catch (error) {
      return {
        jobId,
        status: 'failed',
        error: error as Error
      };
    }
  }
  
  /**
   * Get the status of a sync job
   * @param jobId ID of the job
   */
  public getJobStatus(jobId: string): SyncJobStatus {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new IntegrationError({
        type: IntegrationErrorType.NOT_FOUND,
        message: `Job with ID ${jobId} not found`,
        serviceName: 'integration-manager',
        retryable: false
      });
    }
    
    return job.getStatus();
  }
  
  /**
   * Cancel a sync job
   * @param jobId ID of the job
   */
  public cancelJob(jobId: string): void {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new IntegrationError({
        type: IntegrationErrorType.NOT_FOUND,
        message: `Job with ID ${jobId} not found`,
        serviceName: 'integration-manager',
        retryable: false
      });
    }
    
    job.cancel();
  }
  
  /**
   * Get status information for a service integration
   * @param serviceName Name of the service
   */
  public async checkIntegrationStatus(serviceName: string): Promise<IntegrationStatus> {
    const adapter = this.getAdapter(serviceName);
    
    // Get authentication status
    const authStatus = await adapter.checkAuthStatus();
    
    // Get last sync timestamp
    // In a real implementation, this would query the database
    const lastSyncTimestamp = null; // Placeholder
    
    return {
      serviceName,
      isAuthenticated: authStatus.isAuthenticated,
      lastSyncTimestamp,
      capabilities: adapter.getServiceCapabilities()
    };
  }
  
  /**
   * Validate OAuth callback and exchange for tokens
   * @param serviceName Name of the service
   * @param code OAuth authorization code
   * @param clientId OAuth client ID
   * @param clientSecret OAuth client secret
   * @param redirectUri OAuth redirect URI
   */
  public async handleOAuthCallback(
    serviceName: string,
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<ServiceCredentials> {
    try {
      // This is a simplified example of OAuth token exchange
      // Real implementation would vary by service
      const response = await fetch(`https://oauth.${serviceName}.com/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to exchange code for token: ${response.statusText}`);
      }
      
      const tokenData = await response.json();
      
      // Create credentials object
      const credentials: ServiceCredentials = {
        type: 'oauth',
        client_id: clientId,
        client_secret: clientSecret,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()
      };
      
      // Store the credentials
      await this.updateCredentials(serviceName, credentials);
      
      return credentials;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Failed to process OAuth callback for ${serviceName}: ${(error as Error).message}`,
        serviceName,
        retryable: false,
        originalError: error
      });
    }
  }
  
  /**
   * Process a webhook event from a service
   * @param serviceName Name of the service
   * @param event Webhook event data
   */
  public async processWebhook(
    serviceName: string, 
    event: {
      eventType: string;
      resourceType: string;
      resourceId: string;
      data: any;
      timestamp: Date;
    }
  ): Promise<void> {
    const adapter = this.getAdapter(serviceName);
    
    // Handle the webhook based on event type
    // For example, invalidate cache for updated resources
    if (event.eventType === 'update' || event.eventType === 'create' || event.eventType === 'delete') {
      await adapter.invalidateCache(event.resourceType, event.resourceId);
      
      // Could trigger a sync job to refresh data
      // await this.scheduleSync(serviceName, event.resourceType, { filters: { id: event.resourceId } });
    }
    
    // Real implementation would be more complex and service-specific
    console.log(`Processed webhook for ${serviceName}: ${event.eventType} on ${event.resourceType} ${event.resourceId}`);
  }
  
  /**
   * Create API error from an unknown error
   * @param error Original error
   * @param serviceName Name of the service
   * @param operation Operation that caused the error
   */
  private createApiError(error: any, serviceName: string, operation: string): IntegrationError {
    if (error instanceof IntegrationError) {
      return error;
    }
    
    const errorType = this.categorizeError(error);
    
    return new IntegrationError({
      type: errorType,
      message: `Error in ${serviceName} during ${operation}: ${error.message || 'Unknown error'}`,
      serviceName,
      statusCode: error.status || error.statusCode,
      retryable: this.isRetryable(errorType),
      originalError: error
    });
  }
  
  /**
   * Categorize an unknown error
   * @param error Original error
   */
  private categorizeError(error: any): IntegrationErrorType {
    const status = error.status || error.statusCode;
    
    if (status) {
      if (status === 401) return IntegrationErrorType.AUTHENTICATION;
      if (status === 403) return IntegrationErrorType.AUTHORIZATION;
      if (status === 404) return IntegrationErrorType.RESOURCE_NOT_FOUND;
      if (status === 429) return IntegrationErrorType.RATE_LIMIT;
      if (status >= 500) return IntegrationErrorType.SERVICE_UNAVAILABLE;
    }
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('not found')) {
      return IntegrationErrorType.RESOURCE_NOT_FOUND;
    }
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return IntegrationErrorType.TIMEOUT;
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return IntegrationErrorType.NETWORK;
    }
    
    return IntegrationErrorType.UNKNOWN;
  }
  
  /**
   * Determine if an error is retryable
   * @param errorType Type of error
   */
  private isRetryable(errorType: IntegrationErrorType): boolean {
    switch (errorType) {
      case IntegrationErrorType.NETWORK:
      case IntegrationErrorType.TIMEOUT:
      case IntegrationErrorType.SERVICE_UNAVAILABLE:
      case IntegrationErrorType.RATE_LIMIT:
        return true;
      default:
        return false;
    }
  }
}

// Missing interface - define it
interface SyncJobStatus {
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  resourceType: string;
  progress: number;
  errors: Error[];
  startTime: Date | null;
  endTime: Date | null;
}

/**
 * Get singleton instance of the integration manager
 */
export function getIntegrationManager(): IntegrationManager {
  return IntegrationManager.getInstance();
}
