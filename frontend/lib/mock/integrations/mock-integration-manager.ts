/**
 * Mock Integration Manager
 * 
 * This module provides a mock implementation of the IntegrationManager singleton
 * that coordinates access to various service adapters.
 */

import { mockGoogleWorkspaceAdapter } from './adapters/mock-google-workspace-adapter';

/**
 * The base interface for integration connection status
 */
export interface ConnectionStatus {
  connected: boolean;
  lastSyncTime?: string;
  error?: string | null;
}

/**
 * Mock Implementation of the Integration Manager
 */
export class MockIntegrationManager {
  private static instance: MockIntegrationManager;
  private adapters: Record<string, any> = {};
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize with mock adapters
    this.adapters.googleWorkspace = mockGoogleWorkspaceAdapter;
    
    // In the future, add other adapters here:
    // this.adapters.currentRMS = mockCurrentRMSAdapter;
    // this.adapters.quickbooks = mockQuickbooksAdapter;
    // etc.
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): MockIntegrationManager {
    if (!MockIntegrationManager.instance) {
      MockIntegrationManager.instance = new MockIntegrationManager();
    }
    return MockIntegrationManager.instance;
  }
  
  /**
   * Get an adapter by name
   * @param adapterName Name of the adapter to retrieve
   */
  public getAdapter<T>(adapterName: string): T {
    const adapter = this.adapters[adapterName];
    
    if (!adapter) {
      throw new Error(`Adapter '${adapterName}' not found`);
    }
    
    return adapter as T;
  }
  
  /**
   * Check if an adapter is available
   * @param adapterName Name of the adapter to check
   */
  public hasAdapter(adapterName: string): boolean {
    return !!this.adapters[adapterName];
  }
  
  /**
   * Get status of all available integrations
   */
  public getStatus(): Record<string, ConnectionStatus> {
    const status: Record<string, ConnectionStatus> = {};
    
    // For each adapter, get its connection status
    Object.entries(this.adapters).forEach(([name, adapter]) => {
      if (adapter && typeof adapter.getConnectionStatus === 'function') {
        status[name] = adapter.getConnectionStatus();
      } else {
        status[name] = { connected: false, error: 'Adapter not properly implemented' };
      }
    });
    
    return status;
  }
  
  /**
   * Get all available adapter names
   */
  public getAvailableAdapters(): string[] {
    return Object.keys(this.adapters);
  }
}

/**
 * Export singleton instance
 */
export const mockIntegrationManager = MockIntegrationManager.getInstance();
