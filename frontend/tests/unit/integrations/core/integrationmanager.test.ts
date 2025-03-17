import { IntegrationManager, getIntegrationManager } from '../../../../lib/integrations/core/integrationmanager';
import { BaseAdapter } from '../../../../lib/integrations/core/baseadapter';
import { IntegrationError, IntegrationErrorType } from '../../../../lib/integrations/core/types';
import { MockAdapter } from '../../../mocks/services/mock-adapter';

// Mock the CredentialsManager module
jest.mock('../../../../lib/integrations/core/credentialsmanager', () => {
  const mockCredentialsManager = {
    storeCredentials: jest.fn().mockResolvedValue(undefined),
    getCredentials: jest.fn().mockResolvedValue({ type: 'api_key' as const, key: 'test-key' }),
    hasValidCredentials: jest.fn().mockResolvedValue(true),
    deleteCredentials: jest.fn().mockResolvedValue(undefined)
  };
  
  return {
    getCredentialsManager: jest.fn().mockReturnValue(mockCredentialsManager),
    CredentialsManager: jest.fn(() => mockCredentialsManager)
  };
});

// Mock SyncJob
jest.mock('../../../../lib/integrations/core/syncjob', () => {
  const mockSyncJob = {
    getJobId: jest.fn().mockReturnValue('test-job-id'),
    start: jest.fn().mockResolvedValue({
      successful: true,
      resourceType: 'test-resource',
      recordsProcessed: 5,
      recordsFailed: 0,
      errors: [],
      timestamp: new Date(),
      duration: 100
    }),
    cancel: jest.fn(),
    getStatus: jest.fn().mockReturnValue({
      status: 'running',
      resourceType: 'test-resource',
      progress: 50,
      errors: [],
      startTime: new Date(),
      endTime: null
    }),
    onComplete: jest.fn().mockReturnThis(),
    onError: jest.fn().mockReturnThis()
  };
  
  return {
    SyncJob: jest.fn(() => mockSyncJob)
  };
});

// Mock fetch for OAuth tests
global.fetch = jest.fn();

describe('IntegrationManager', () => {
  let manager: IntegrationManager;
  let mockAdapter: MockAdapter;
  
  beforeEach(() => {
    // Reset the singleton between tests
    // This is a hack to reset the singleton for testing
    (IntegrationManager as any).instance = undefined;
    
    // Get a fresh instance
    manager = getIntegrationManager();
    
    // Create a mock adapter
    mockAdapter = new MockAdapter();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup fetch mock to return successful OAuth token
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600
      })
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Singleton Pattern', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const manager1 = IntegrationManager.getInstance();
      const manager2 = IntegrationManager.getInstance();
      
      expect(manager1).toBe(manager2);
    });
    
    it('should return the same instance when getIntegrationManager is called', () => {
      const instance = IntegrationManager.getInstance();
      const fromHelper = getIntegrationManager();
      
      expect(instance).toBe(fromHelper);
    });
  });
  
  describe('Adapter Management', () => {
    it('should register and retrieve an adapter', () => {
      manager.registerAdapter(mockAdapter);
      
      const retrievedAdapter = manager.getAdapter('mock-service');
      
      expect(retrievedAdapter).toBe(mockAdapter);
    });
    
    it('should throw an error when retrieving a non-existent adapter', () => {
      expect(() => manager.getAdapter('non-existent')).toThrow(IntegrationError);
      expect(() => manager.getAdapter('non-existent')).toThrow(/not found/);
    });
    
    it('should check if an adapter exists', () => {
      expect(manager.hasAdapter('mock-service')).toBe(false);
      
      manager.registerAdapter(mockAdapter);
      
      expect(manager.hasAdapter('mock-service')).toBe(true);
    });
    
    it('should get all registered service names', () => {
      manager.registerAdapter(mockAdapter);
      
      const anotherAdapter = new MockAdapter();
      jest.spyOn(anotherAdapter, 'getServiceName').mockReturnValue('another-service');
      manager.registerAdapter(anotherAdapter);
      
      const services = manager.getRegisteredServices();
      
      expect(services).toContain('mock-service');
      expect(services).toContain('another-service');
      expect(services.length).toBe(2);
    });
    
    it('should warn when replacing an existing adapter', () => {
      manager.registerAdapter(mockAdapter);
      
      const replacementAdapter = new MockAdapter();
      manager.registerAdapter(replacementAdapter);
      
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Replacing existing adapter'));
    });
  });
  
  describe('Adapter Initialization', () => {
    it('should initialize an adapter with credentials', async () => {
      manager.registerAdapter(mockAdapter);
      
      await manager.initializeAdapter('mock-service');
      
      expect(mockAdapter.authenticateCalled).toBe(true);
    });
    
    it('should throw an error when initialization fails', async () => {
      manager.registerAdapter(mockAdapter);
      
      // Make authentication fail
      jest.spyOn(mockAdapter, 'authenticate').mockRejectedValue(new Error('Auth failed'));
      
      await expect(manager.initializeAdapter('mock-service')).rejects.toThrow(IntegrationError);
      await expect(manager.initializeAdapter('mock-service')).rejects.toThrow(/Auth failed/);
    });
  });
  
  describe('Credential Management', () => {
    it('should update credentials for a service', async () => {
      const credentialsManager = require('../../../../lib/integrations/core/credentialsmanager').getCredentialsManager();
      
      manager.registerAdapter(mockAdapter);
      
      await manager.updateCredentials('mock-service', { 
        type: 'api_key' as const, 
        key: 'new-api-key' 
      });
      
      expect(credentialsManager.storeCredentials).toHaveBeenCalledWith(
        'mock-service', 
        { type: 'api_key', key: 'new-api-key' }
      );
    });
    
    it('should remove credentials for a service', async () => {
      const credentialsManager = require('../../../../lib/integrations/core/credentialsmanager').getCredentialsManager();
      
      await manager.removeCredentials('mock-service');
      
      expect(credentialsManager.deleteCredentials).toHaveBeenCalledWith('mock-service');
    });
  });
  
  describe('Sync Job Management', () => {
    it('should schedule a sync job', async () => {
      const SyncJob = require('../../../../lib/integrations/core/syncjob').SyncJob;
      
      manager.registerAdapter(mockAdapter);
      
      const result = await manager.scheduleSync('mock-service', 'test-resource', { fullSync: true });
      
      expect(result.status).toBe('completed');
      expect(result.jobId).toBe('test-job-id');
      expect(SyncJob).toHaveBeenCalledWith(mockAdapter, 'test-resource', { fullSync: true });
    });
    
    it('should get job status', () => {
      const mockSyncJob = require('../../../../lib/integrations/core/syncjob').SyncJob();
      
      manager.registerAdapter(mockAdapter);
      
      // Simulate a job being scheduled
      manager['activeJobs'] = new Map([['test-job-id', mockSyncJob]]);
      
      const status = manager.getJobStatus('test-job-id');
      
      expect(status.status).toBe('running');
      expect(status.resourceType).toBe('test-resource');
      expect(mockSyncJob.getStatus).toHaveBeenCalled();
    });
    
    it('should throw an error when getting status of a non-existent job', () => {
      expect(() => manager.getJobStatus('non-existent')).toThrow(IntegrationError);
      expect(() => manager.getJobStatus('non-existent')).toThrow(/not found/);
    });
    
    it('should cancel a job', () => {
      const mockSyncJob = require('../../../../lib/integrations/core/syncjob').SyncJob();
      
      // Simulate a job being scheduled
      manager['activeJobs'] = new Map([['test-job-id', mockSyncJob]]);
      
      manager.cancelJob('test-job-id');
      
      expect(mockSyncJob.cancel).toHaveBeenCalled();
    });
    
    it('should throw an error when canceling a non-existent job', () => {
      expect(() => manager.cancelJob('non-existent')).toThrow(IntegrationError);
      expect(() => manager.cancelJob('non-existent')).toThrow(/not found/);
    });
  });
  
  describe('Integration Status', () => {
    it('should check integration status', async () => {
      manager.registerAdapter(mockAdapter);
      
      const status = await manager.checkIntegrationStatus('mock-service');
      
      expect(status.serviceName).toBe('mock-service');
      expect(status.isAuthenticated).toBe(true);
      expect(mockAdapter.checkAuthStatusCalled).toBe(true);
    });
  });
  
  describe('OAuth Handling', () => {
    it('should handle OAuth callback successfully', async () => {
      const credentialsManager = require('../../../../lib/integrations/core/credentialsmanager').getCredentialsManager();
      
      const credentials = await manager.handleOAuthCallback(
        'example',
        'auth-code',
        'client-id',
        'client-secret',
        'http://redirect'
      );
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://oauth.example.com/token',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('auth-code')
        })
      );
      
      expect(credentials.type).toBe('oauth');
      expect(credentials.access_token).toBe('test-access-token');
      expect(credentials.refresh_token).toBe('test-refresh-token');
      expect(credentialsManager.storeCredentials).toHaveBeenCalled();
    });
    
    it('should throw an error when OAuth exchange fails', async () => {
      // Make fetch fail
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Bad Request'
      });
      
      await expect(manager.handleOAuthCallback(
        'example',
        'bad-code',
        'client-id',
        'client-secret',
        'http://redirect'
      )).rejects.toThrow(IntegrationError);
      
      await expect(manager.handleOAuthCallback(
        'example',
        'bad-code',
        'client-id',
        'client-secret',
        'http://redirect'
      )).rejects.toThrow(/Failed to process OAuth callback/);
    });
  });
  
  describe('Webhook Processing', () => {
    it('should process a webhook event', async () => {
      manager.registerAdapter(mockAdapter);
      
      // Set credentials on the mock adapter to avoid authentication error
      mockAdapter.setCredentials({ type: 'api_key' as const, key: 'test-key' });
      
      const event = {
        eventType: 'update',
        resourceType: 'item',
        resourceId: '123',
        data: { id: '123', name: 'Updated Item' },
        timestamp: new Date()
      };
      
      await manager.processWebhook('mock-service', event);
      
      expect(mockAdapter.invalidateCacheCalled).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    it('should categorize errors correctly', () => {
      const testErrors = [
        { error: { status: 401 }, expected: IntegrationErrorType.AUTHENTICATION },
        { error: { status: 403 }, expected: IntegrationErrorType.AUTHORIZATION },
        { error: { status: 404 }, expected: IntegrationErrorType.RESOURCE_NOT_FOUND },
        { error: { status: 429 }, expected: IntegrationErrorType.RATE_LIMIT },
        { error: { status: 500 }, expected: IntegrationErrorType.SERVICE_UNAVAILABLE },
        { error: { message: 'not found' }, expected: IntegrationErrorType.RESOURCE_NOT_FOUND },
        { error: { message: 'timed out' }, expected: IntegrationErrorType.TIMEOUT },
        { error: { message: 'network error' }, expected: IntegrationErrorType.NETWORK },
        { error: { message: 'unknown error' }, expected: IntegrationErrorType.UNKNOWN },
      ];
      
      testErrors.forEach(({ error, expected }) => {
        expect(manager['categorizeError'](error)).toBe(expected);
      });
    });
    
    it('should identify retryable errors', () => {
      const retryableTypes = [
        IntegrationErrorType.NETWORK,
        IntegrationErrorType.TIMEOUT,
        IntegrationErrorType.SERVICE_UNAVAILABLE,
        IntegrationErrorType.RATE_LIMIT
      ];
      
      const nonRetryableTypes = [
        IntegrationErrorType.AUTHENTICATION,
        IntegrationErrorType.AUTHORIZATION,
        IntegrationErrorType.RESOURCE_NOT_FOUND,
        IntegrationErrorType.VALIDATION,
        IntegrationErrorType.UNKNOWN
      ];
      
      retryableTypes.forEach(type => {
        expect(manager['isRetryable'](type)).toBe(true);
      });
      
      nonRetryableTypes.forEach(type => {
        expect(manager['isRetryable'](type)).toBe(false);
      });
    });
    
    it('should create standardized API errors', () => {
      const originalError = { status: 429, message: 'Too many requests' };
      const error = manager['createApiError'](originalError, 'test-service', 'test-operation');
      
      expect(error).toBeInstanceOf(IntegrationError);
      expect(error.type).toBe(IntegrationErrorType.RATE_LIMIT);
      expect(error.serviceName).toBe('test-service');
      expect(error.message).toContain('test-operation');
      expect(error.retryable).toBe(true);
    });
    
    it('should return the original error if it is already an IntegrationError', () => {
      const originalError = new IntegrationError({
        type: IntegrationErrorType.TIMEOUT,
        message: 'Test timeout',
        serviceName: 'test-service'
      });
      
      const error = manager['createApiError'](originalError, 'another-service', 'test-operation');
      
      expect(error).toBe(originalError);
    });
  });
});
