import { BaseAdapter } from '../../../lib/integrations/core/baseadapter';
import type {
  AuthResult,
  AuthStatus,
  FetchOptions,
  QueryOptions,
  ServiceCapabilities,
  ServiceCredentials,
  SyncOptions,
  SyncResult
} from '../../../lib/integrations/core/types';

/**
 * Mock implementation of BaseAdapter for testing
 */
export class MockAdapter extends BaseAdapter {
  public fetchResourceCalled = false;
  public fetchResourcesCalled = false;
  public createResourceCalled = false;
  public updateResourceCalled = false;
  public deleteResourceCalled = false;
  public syncToCacheCalled = false;
  public invalidateCacheCalled = false;
  public getCachedResourceCalled = false;
  public getCachedResourcesCalled = false;
  public authenticateCalled = false;
  public refreshAuthenticationCalled = false;
  public checkAuthStatusCalled = false;
  
  constructor() {
    super('mock-service');
  }

  async fetchResource<T>(resourceType: string, id: string, options?: FetchOptions): Promise<T> {
    this.fetchResourceCalled = true;
    this.ensureCredentials();
    return { id, type: resourceType } as unknown as T;
  }
  
  async fetchResources<T>(resourceType: string, query: QueryOptions): Promise<T[]> {
    this.fetchResourcesCalled = true;
    this.ensureCredentials();
    return [{ type: resourceType }] as unknown as T[];
  }
  
  async createResource<T>(resourceType: string, data: any): Promise<T> {
    this.createResourceCalled = true;
    this.ensureCredentials();
    return { ...data, id: 'new-id', type: resourceType } as unknown as T;
  }
  
  async updateResource<T>(resourceType: string, id: string, data: any): Promise<T> {
    this.updateResourceCalled = true;
    this.ensureCredentials();
    return { ...data, id, type: resourceType } as unknown as T;
  }
  
  async deleteResource(resourceType: string, id: string): Promise<void> {
    this.deleteResourceCalled = true;
    this.ensureCredentials();
  }
  
  async syncToCache(resourceType: string, options?: SyncOptions): Promise<SyncResult> {
    this.syncToCacheCalled = true;
    this.ensureCredentials();
    return {
      successful: true,
      resourceType,
      recordsProcessed: 10,
      recordsFailed: 0,
      errors: [],
      timestamp: new Date(),
      duration: 100,
      fullSync: options?.fullSync
    };
  }
  
  async invalidateCache(resourceType: string, id?: string): Promise<void> {
    this.invalidateCacheCalled = true;
    this.ensureCredentials();
  }
  
  async getCachedResource<T>(resourceType: string, id: string): Promise<T> {
    this.getCachedResourceCalled = true;
    this.ensureCredentials();
    return { id, type: resourceType, cached: true } as unknown as T;
  }
  
  async getCachedResources<T>(resourceType: string, query: QueryOptions): Promise<T[]> {
    this.getCachedResourcesCalled = true;
    this.ensureCredentials();
    return [{ type: resourceType, cached: true }] as unknown as T[];
  }
  
  async authenticate(): Promise<AuthResult> {
    this.authenticateCalled = true;
    return {
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 3600000),
      credentials: {
        type: 'api_key',
        key: 'mock-api-key'
      }
    };
  }
  
  async refreshAuthentication(): Promise<AuthResult> {
    this.refreshAuthenticationCalled = true;
    return {
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 3600000),
      credentials: {
        type: 'api_key',
        key: 'mock-refreshed-api-key'
      }
    };
  }
  
  async checkAuthStatus(): Promise<AuthStatus> {
    this.checkAuthStatusCalled = true;
    return {
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 3600000)
    };
  }
  
  getServiceCapabilities(): ServiceCapabilities {
    return {
      resources: ['items', 'orders'],
      operations: {
        'items': ['read', 'create', 'update', 'delete'],
        'orders': ['read', 'create']
      },
      features: ['caching', 'webhooks']
    };
  }

  // Expose protected methods for testing
  public exposedCreateError(error: any, operation: string) {
    return this.createError(error, operation);
  }
  
  public exposedCategorizeError(error: any) {
    return this.categorizeError(error);
  }
  
  public exposedIsRetryable(errorType: any, error: any) {
    return this.isRetryable(errorType, error);
  }
}
