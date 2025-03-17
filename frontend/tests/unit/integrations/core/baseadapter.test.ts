import { MockAdapter } from '../../../mocks/services/mock-adapter';
import { IntegrationError, IntegrationErrorType } from '../../../../lib/integrations/core/types';

describe('BaseAdapter', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
    // Set credentials for most tests
    adapter.setCredentials({
      type: 'api_key' as const,
      key: 'test-api-key'
    });
  });

  describe('constructor', () => {
    it('should set the service name', () => {
      expect(adapter.getServiceName()).toBe('mock-service');
    });
  });

  describe('credential management', () => {
    it('should store credentials when set', () => {
      const credentials = { type: 'api_key' as const, key: 'another-key' };
      adapter.setCredentials(credentials);
      // We're testing implementation details, which is not ideal, but useful for this core class
      expect(adapter['credentials']).toEqual(credentials);
    });

    it('should throw an error when credentials are not set', async () => {
      // Create a new adapter without credentials
      const noCredentialsAdapter = new MockAdapter();
      
      await expect(noCredentialsAdapter.fetchResource('test', '123')).rejects
        .toThrow('No credentials set for mock-service');
    });

    it('should check credentials before performing operations', async () => {
      const noCredentialsAdapter = new MockAdapter();
      
      // Each operation should check for credentials
      await expect(noCredentialsAdapter.fetchResource('test', '123')).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.fetchResources('test', {})).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.createResource('test', {})).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.updateResource('test', '123', {})).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.deleteResource('test', '123')).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.syncToCache('test')).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.invalidateCache('test')).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.getCachedResource('test', '123')).rejects
        .toBeInstanceOf(IntegrationError);
      await expect(noCredentialsAdapter.getCachedResources('test', {})).rejects
        .toBeInstanceOf(IntegrationError);
    });
  });

  describe('error categorization', () => {
    it('should categorize errors by HTTP status code', () => {
      const testCases = [
        { status: 401, expected: IntegrationErrorType.AUTHENTICATION },
        { status: 403, expected: IntegrationErrorType.AUTHORIZATION },
        { status: 404, expected: IntegrationErrorType.RESOURCE_NOT_FOUND },
        { status: 422, expected: IntegrationErrorType.VALIDATION },
        { status: 429, expected: IntegrationErrorType.RATE_LIMIT },
        { status: 500, expected: IntegrationErrorType.SERVICE_UNAVAILABLE },
        { status: 503, expected: IntegrationErrorType.SERVICE_UNAVAILABLE },
      ];

      testCases.forEach(({ status, expected }) => {
        const error = { status, message: 'Error message' };
        expect(adapter.exposedCategorizeError(error)).toBe(expected);
      });
    });

    it('should categorize errors by message content', () => {
      const testCases = [
        { message: 'Request timed out', expected: IntegrationErrorType.TIMEOUT },
        { message: 'Network error occurred', expected: IntegrationErrorType.NETWORK },
        { message: 'Resource not found', expected: IntegrationErrorType.RESOURCE_NOT_FOUND },
        { message: 'Rate limit exceeded', expected: IntegrationErrorType.RATE_LIMIT },
        { message: 'Unauthorized access', expected: IntegrationErrorType.AUTHENTICATION },
        { message: 'Random error', expected: IntegrationErrorType.UNKNOWN },
      ];

      testCases.forEach(({ message, expected }) => {
        const error = { message };
        expect(adapter.exposedCategorizeError(error)).toBe(expected);
      });
    });

    it('should return the type of an existing IntegrationError', () => {
      const integrationError = new IntegrationError({
        type: IntegrationErrorType.TIMEOUT,
        message: 'Test timeout',
        serviceName: 'test-service'
      });

      expect(adapter.exposedCategorizeError(integrationError)).toBe(IntegrationErrorType.TIMEOUT);
    });
  });

  describe('retry determination', () => {
    it('should identify retryable error types', () => {
      const retryableTypes = [
        IntegrationErrorType.NETWORK,
        IntegrationErrorType.TIMEOUT,
        IntegrationErrorType.SERVICE_UNAVAILABLE,
        IntegrationErrorType.RATE_LIMIT
      ];

      retryableTypes.forEach(type => {
        expect(adapter.exposedIsRetryable(type, {})).toBe(true);
      });
    });

    it('should identify non-retryable error types', () => {
      const nonRetryableTypes = [
        IntegrationErrorType.AUTHENTICATION,
        IntegrationErrorType.AUTHORIZATION,
        IntegrationErrorType.VALIDATION,
        IntegrationErrorType.RESOURCE_NOT_FOUND
      ];

      nonRetryableTypes.forEach(type => {
        expect(adapter.exposedIsRetryable(type, {})).toBe(false);
      });
    });

    it('should consider 5xx status codes as retryable for unknown errors', () => {
      expect(adapter.exposedIsRetryable(IntegrationErrorType.UNKNOWN, { status: 500 })).toBe(true);
      expect(adapter.exposedIsRetryable(IntegrationErrorType.UNKNOWN, { status: 502 })).toBe(true);
      expect(adapter.exposedIsRetryable(IntegrationErrorType.UNKNOWN, { status: 503 })).toBe(true);
    });

    it('should default to non-retryable for unknown errors without 5xx status', () => {
      expect(adapter.exposedIsRetryable(IntegrationErrorType.UNKNOWN, {})).toBe(false);
      expect(adapter.exposedIsRetryable(IntegrationErrorType.UNKNOWN, { status: 400 })).toBe(false);
    });
  });

  describe('error creation', () => {
    it('should create standardized integration errors', () => {
      const originalError = { status: 429, message: 'Too many requests' };
      const error = adapter.exposedCreateError(originalError, 'fetchData');

      expect(error).toBeInstanceOf(IntegrationError);
      expect(error.type).toBe(IntegrationErrorType.RATE_LIMIT);
      expect(error.serviceName).toBe('mock-service');
      expect(error.statusCode).toBe(429);
      expect(error.retryable).toBe(true);
      expect(error.originalError).toBe(originalError);
      expect(error.message).toContain('mock-service');
      expect(error.message).toContain('fetchData');
      expect(error.message).toContain('Too many requests');
    });

    it('should preserve original error details', () => {
      const originalError = { 
        status: 404, 
        message: 'Not found',
        additionalInfo: 'Some extra context'
      };
      
      const error = adapter.exposedCreateError(originalError, 'getResource');
      expect(error.originalError).toEqual(originalError);
    });
  });

  describe('adapter methods with credentials', () => {
    it('should call fetchResource successfully', async () => {
      const result = await adapter.fetchResource('test', '123');
      expect(adapter.fetchResourceCalled).toBe(true);
      expect(result).toEqual({ id: '123', type: 'test' });
    });

    it('should call fetchResources successfully', async () => {
      const result = await adapter.fetchResources('test', {});
      expect(adapter.fetchResourcesCalled).toBe(true);
      expect(result).toEqual([{ type: 'test' }]);
    });

    it('should call createResource successfully', async () => {
      const data = { name: 'Test Item' };
      const result = await adapter.createResource('test', data);
      expect(adapter.createResourceCalled).toBe(true);
      expect(result).toEqual({ ...data, id: 'new-id', type: 'test' });
    });

    it('should call updateResource successfully', async () => {
      const data = { name: 'Updated Item' };
      const result = await adapter.updateResource('test', '123', data);
      expect(adapter.updateResourceCalled).toBe(true);
      expect(result).toEqual({ ...data, id: '123', type: 'test' });
    });

    it('should call deleteResource successfully', async () => {
      await adapter.deleteResource('test', '123');
      expect(adapter.deleteResourceCalled).toBe(true);
    });

    it('should call syncToCache successfully', async () => {
      const result = await adapter.syncToCache('test', { fullSync: true });
      expect(adapter.syncToCacheCalled).toBe(true);
      expect(result.successful).toBe(true);
      expect(result.resourceType).toBe('test');
      expect(result.fullSync).toBe(true);
    });

    it('should call getCachedResource successfully', async () => {
      const result = await adapter.getCachedResource('test', '123');
      expect(adapter.getCachedResourceCalled).toBe(true);
      expect(result).toEqual({ id: '123', type: 'test', cached: true });
    });

    it('should call getCachedResources successfully', async () => {
      const result = await adapter.getCachedResources('test', {});
      expect(adapter.getCachedResourcesCalled).toBe(true);
      expect(result).toEqual([{ type: 'test', cached: true }]);
    });
  });

  describe('authentication methods', () => {
    it('should call authenticate successfully', async () => {
      const result = await adapter.authenticate();
      expect(adapter.authenticateCalled).toBe(true);
      expect(result.isAuthenticated).toBe(true);
      expect(result.credentials).toBeDefined();
    });

    it('should call refreshAuthentication successfully', async () => {
      const result = await adapter.refreshAuthentication();
      expect(adapter.refreshAuthenticationCalled).toBe(true);
      expect(result.isAuthenticated).toBe(true);
      expect(result.credentials?.key).toBe('mock-refreshed-api-key');
    });

    it('should call checkAuthStatus successfully', async () => {
      const result = await adapter.checkAuthStatus();
      expect(adapter.checkAuthStatusCalled).toBe(true);
      expect(result.isAuthenticated).toBe(true);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });
  });
});
