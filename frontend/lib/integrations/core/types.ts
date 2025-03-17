/**
 * Core type definitions for the integration framework
 */

/**
 * Error types for integration operations
 */
export enum IntegrationErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate_limit',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  VALIDATION = 'validation',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

/**
 * Options for creating an integration error
 */
export interface IntegrationErrorOptions {
  type: IntegrationErrorType;
  message: string;
  serviceName: string;
  statusCode?: number;
  retryable?: boolean;
  originalError?: any;
}

/**
 * Custom error class for integration errors
 */
export class IntegrationError extends Error {
  type: IntegrationErrorType;
  serviceName: string;
  statusCode?: number;
  retryable: boolean;
  originalError?: any;
  
  constructor(options: IntegrationErrorOptions) {
    super(options.message);
    this.name = 'IntegrationError';
    this.type = options.type;
    this.serviceName = options.serviceName;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable ?? false;
    this.originalError = options.originalError;
  }
  
  /**
   * Check if the error should be retried
   */
  shouldRetry(): boolean {
    return this.retryable;
  }
  
  /**
   * Check if this is an authentication error
   */
  isAuthError(): boolean {
    return this.type === IntegrationErrorType.AUTHENTICATION || 
           this.type === IntegrationErrorType.AUTHORIZATION;
  }
  
  /**
   * Get a user-friendly recommendation for handling this error
   */
  getRecommendedAction(): string {
    switch(this.type) {
      case IntegrationErrorType.AUTHENTICATION:
        return 'Please reconnect the integration';
      case IntegrationErrorType.AUTHORIZATION:
        return 'You may not have permission to access this resource';
      case IntegrationErrorType.RATE_LIMIT:
        return 'Please try again later';
      case IntegrationErrorType.RESOURCE_NOT_FOUND:
        return 'The requested resource could not be found';
      case IntegrationErrorType.VALIDATION:
        return 'The request data was invalid';
      case IntegrationErrorType.SERVICE_UNAVAILABLE:
        return 'The service is currently unavailable, please try again later';
      case IntegrationErrorType.NETWORK:
        return 'There was a network error, please check your connection';
      case IntegrationErrorType.TIMEOUT:
        return 'The request timed out, please try again';
      default:
        return 'An unexpected error occurred';
    }
  }
}

/**
 * Service credentials for API authentication
 */
export interface ServiceCredentials {
  type: 'api_key' | 'oauth' | 'basic';
  [key: string]: any;
}

/**
 * Status of authentication with a service
 */
export interface AuthStatus {
  isAuthenticated: boolean;
  expiresAt?: Date;
  error?: string;
}

/**
 * Result of an authentication operation
 */
export interface AuthResult extends AuthStatus {
  credentials?: ServiceCredentials;
}

/**
 * Capabilities supported by a service
 */
export interface ServiceCapabilities {
  resources: string[];
  operations: {
    [resourceType: string]: ('read' | 'create' | 'update' | 'delete')[]
  };
  features: string[];
}

/**
 * Options for fetching a single resource
 */
export interface FetchOptions {
  fields?: string[];
  expand?: string[];
  [key: string]: any;
}

/**
 * Options for querying multiple resources
 */
export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
  fields?: string[];
  expand?: string[];
  [key: string]: any;
}

/**
 * Options for syncing data to cache
 */
export interface SyncOptions {
  fullSync?: boolean;
  sinceDatetime?: Date;
  filters?: Record<string, any>;
  batchSize?: number;
  maxRecords?: number;
  priority?: 'high' | 'normal' | 'low';
  timeout?: number;
}

/**
 * Result of a sync operation
 */
export interface SyncResult {
  successful: boolean;
  resourceType: string;
  recordsProcessed: number;
  recordsFailed: number;
  errors: Error[];
  timestamp: Date;
  duration: number;
  fullSync?: boolean;
}

/**
 * Result of a job
 */
export interface JobResult {
  jobId: string;
  status: 'completed' | 'failed' | 'in_progress';
  result?: SyncResult;
  error?: Error;
}

/**
 * Status of a service integration
 */
export interface IntegrationStatus {
  serviceName: string;
  isAuthenticated: boolean;
  lastSyncTimestamp: Date | null;
  capabilities: ServiceCapabilities;
}

/**
 * Status of a sync job
 */
export interface SyncJobStatus {
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  resourceType: string;
  progress: number;
  errors: Error[];
  startTime: Date | null;
  endTime: Date | null;
}

/**
 * Callback for job progress updates
 */
export type ProgressCallback = (progress: number, total: number) => void;

/**
 * Callback for job completion
 */
export type CompletionCallback = (result: SyncResult) => void;

/**
 * Callback for job errors
 */
export type ErrorCallback = (error: Error) => void;

/**
 * Options for retry strategy
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  factor?: number;
}
