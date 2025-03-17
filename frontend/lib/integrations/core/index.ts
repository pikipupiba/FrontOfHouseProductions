/**
 * Core Integration Framework
 * 
 * This module provides a standardized framework for integrating with external services.
 * It includes components for adapter management, authentication, caching, and job processing.
 */

// Import directly to avoid circular dependency
import { IntegrationManager } from './integrationmanager';

// Re-export all core types
export * from './types';

// Export the base adapter class
export { BaseAdapter } from './baseadapter';

// Export the retry logic utilities
export { 
  RetryStrategy, 
  createRetryStrategy, 
  defaultRetryStrategy,
  withRetry 
} from './retrylogic';

// Export the credentials manager
export { 
  CredentialsManager, 
  getCredentialsManager 
} from './credentialsmanager';

// Export the sync job utilities
export { 
  SyncJob, 
  createSyncJob 
} from './syncjob';

// Export the integration manager
export { 
  IntegrationManager, 
  getIntegrationManager 
} from './integrationmanager';

/**
 * Initialize the integration framework
 * This is a convenience function to set up the integration framework
 * with default settings.
 */

export async function initIntegrationFramework(): Promise<void> {
  // Get the integration manager instance directly 
  const integrationManager = IntegrationManager.getInstance();
  
  // In a real implementation, we might:
  // 1. Register built-in adapters
  // 2. Initialize default settings
  // 3. Set up background job processing
  
  console.log('Integration framework initialized');
  
  return Promise.resolve();
}
