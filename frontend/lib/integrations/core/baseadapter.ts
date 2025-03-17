import { IntegrationError, IntegrationErrorType } from './types';
import type {
  AuthResult,
  AuthStatus,
  FetchOptions,
  QueryOptions,
  ServiceCapabilities,
  ServiceCredentials,
  SyncOptions,
  SyncResult
} from './types';

/**
 * Abstract base class for all service-specific adapters
 * Defines the standard interface that all adapters must implement
 */
export abstract class BaseAdapter {
  protected serviceName: string;
  protected credentials?: ServiceCredentials;
  
  /**
   * Create a new adapter
   * @param serviceName Name of the service this adapter connects to
   */
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }
  
  /**
   * Set the credentials for this adapter
   * @param credentials Service credentials
   */
  public setCredentials(credentials: ServiceCredentials): void {
    this.credentials = credentials;
  }
  
  /**
   * Get the name of the service
   */
  public getServiceName(): string {
    return this.serviceName;
  }
  
  /**
   * Fetch a single resource by ID
   * @param resourceType Type of resource to fetch
   * @param id Identifier of the resource
   * @param options Additional fetch options
   */
  abstract fetchResource<T>(
    resourceType: string, 
    id: string, 
    options?: FetchOptions
  ): Promise<T>;
  
  /**
   * Fetch multiple resources based on query options
   * @param resourceType Type of resources to fetch
   * @param query Query options for filtering, sorting, etc.
   */
  abstract fetchResources<T>(
    resourceType: string, 
    query: QueryOptions
  ): Promise<T[]>;
  
  /**
   * Create a new resource
   * @param resourceType Type of resource to create
   * @param data Resource data
   */
  abstract createResource<T>(
    resourceType: string, 
    data: any
  ): Promise<T>;
  
  /**
   * Update an existing resource
   * @param resourceType Type of resource to update
   * @param id Identifier of the resource
   * @param data Updated resource data
   */
  abstract updateResource<T>(
    resourceType: string, 
    id: string, 
    data: any
  ): Promise<T>;
  
  /**
   * Delete a resource
   * @param resourceType Type of resource to delete
   * @param id Identifier of the resource
   */
  abstract deleteResource(
    resourceType: string, 
    id: string
  ): Promise<void>;
  
  /**
   * Synchronize external data to local cache
   * @param resourceType Type of resources to sync
   * @param options Sync options
   */
  abstract syncToCache(
    resourceType: string, 
    options?: SyncOptions
  ): Promise<SyncResult>;
  
  /**
   * Invalidate cached data
   * @param resourceType Type of resources to invalidate
   * @param id Optional specific resource ID to invalidate
   */
  abstract invalidateCache(
    resourceType: string, 
    id?: string
  ): Promise<void>;
  
  /**
   * Get a resource from cache
   * @param resourceType Type of resource to retrieve
   * @param id Identifier of the resource
   */
  abstract getCachedResource<T>(
    resourceType: string, 
    id: string
  ): Promise<T>;
  
  /**
   * Get multiple resources from cache based on query
   * @param resourceType Type of resources to retrieve
   * @param query Query options for filtering, sorting, etc.
   */
  abstract getCachedResources<T>(
    resourceType: string, 
    query: QueryOptions
  ): Promise<T[]>;
  
  /**
   * Authenticate with the service
   */
  abstract authenticate(): Promise<AuthResult>;
  
  /**
   * Refresh authentication tokens
   */
  abstract refreshAuthentication(): Promise<AuthResult>;
  
  /**
   * Check authentication status
   */
  abstract checkAuthStatus(): Promise<AuthStatus>;
  
  /**
   * Get the capabilities of this service
   */
  abstract getServiceCapabilities(): ServiceCapabilities;
  
  /**
   * Create an IntegrationError from a raw error
   * @param error Original error
   * @param operation Operation that caused the error
   * @returns Standardized IntegrationError
   */
  protected createError(error: any, operation: string): IntegrationError {
    const errorType = this.categorizeError(error);
    const retryable = this.isRetryable(errorType, error);
    
    return new IntegrationError({
      type: errorType,
      message: `Error in ${this.serviceName} during ${operation}: ${error.message || 'Unknown error'}`,
      serviceName: this.serviceName,
      statusCode: error.status || error.statusCode,
      retryable,
      originalError: error
    });
  }
  
  /**
   * Categorize an error into a standard type
   * @param error Original error
   * @returns Categorized error type
   */
  protected categorizeError(error: any): IntegrationErrorType {
    // If it's already our error type, return its type
    if (error instanceof IntegrationError) {
      return error.type;
    }
    
    const status = error.status || error.statusCode;
    
    // Status-based categorization
    if (status) {
      if (status === 401) return IntegrationErrorType.AUTHENTICATION;
      if (status === 403) return IntegrationErrorType.AUTHORIZATION;
      if (status === 404) return IntegrationErrorType.RESOURCE_NOT_FOUND;
      if (status === 422) return IntegrationErrorType.VALIDATION;
      if (status === 429) return IntegrationErrorType.RATE_LIMIT;
      if (status >= 500) return IntegrationErrorType.SERVICE_UNAVAILABLE;
    }
    
    // Message-based categorization
    const message = error.message?.toLowerCase() || '';
    if (message.includes('timed out') || message.includes('timeout')) {
      return IntegrationErrorType.TIMEOUT;
    }
    if (message.includes('network') || message.includes('connection')) {
      return IntegrationErrorType.NETWORK;
    }
    if (message.includes('not found') || message.includes('404')) {
      return IntegrationErrorType.RESOURCE_NOT_FOUND;
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return IntegrationErrorType.RATE_LIMIT;
    }
    if (message.includes('unauthorized') || message.includes('unauthenticated')) {
      return IntegrationErrorType.AUTHENTICATION;
    }
    
    return IntegrationErrorType.UNKNOWN;
  }
  
  /**
   * Determine if an error should be retried
   * @param errorType Type of error
   * @param error Original error
   * @returns Whether the error is retryable
   */
  protected isRetryable(errorType: IntegrationErrorType, error: any): boolean {
    switch (errorType) {
      case IntegrationErrorType.NETWORK:
      case IntegrationErrorType.TIMEOUT:
      case IntegrationErrorType.SERVICE_UNAVAILABLE:
      case IntegrationErrorType.RATE_LIMIT:
        return true;
      
      // Non-retryable errors
      case IntegrationErrorType.AUTHENTICATION:
      case IntegrationErrorType.AUTHORIZATION:
      case IntegrationErrorType.VALIDATION:
      case IntegrationErrorType.RESOURCE_NOT_FOUND:
        return false;
      
      // For unknown errors, make a best guess
      case IntegrationErrorType.UNKNOWN:
      default:
        // Status codes in the 5xx range are typically retryable
        const status = error.status || error.statusCode;
        if (status && status >= 500 && status < 600) {
          return true;
        }
        
        // Default to not retryable for safety
        return false;
    }
  }
  
  /**
   * Check if credentials are available
   * @throws IntegrationError if no credentials are set
   */
  protected ensureCredentials(): void {
    if (!this.credentials) {
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `No credentials set for ${this.serviceName}`,
        serviceName: this.serviceName,
        retryable: false
      });
    }
  }
}
