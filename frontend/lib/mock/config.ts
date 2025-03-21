/**
 * Wireframe Configuration
 * 
 * This file contains configuration settings for the wireframe implementation.
 * In this simplified version, we've removed environment variable checks and
 * use hardcoded values for a cleaner implementation.
 */

/**
 * Configuration for different aspects of the wireframe implementation
 */
export const wireframeConfig = {
  /**
   * Wireframe mode is always enabled in this implementation
   */
  enabled: true,
  
  /**
   * Default delay for mock operations in milliseconds
   */
  defaultDelay: 300,
  
  /**
   * Whether to persist authentication in localStorage
   */
  persistAuth: true,
  
  /**
   * Whether to simulate occasional failures
   * Set to false by default for demo consistency
   */
  simulateFailures: false,
  
  /**
   * Rate of simulated failures (0-1) if enabled
   */
  failureRate: 0.05, // 5% failure rate
  
  /**
   * Authentication settings
   */
  auth: {
    /**
     * Session storage key in localStorage
     */
    sessionStorageKey: 'mock_auth_session',
    
    /**
     * Default session duration in milliseconds (24 hours)
     */
    sessionDuration: 24 * 60 * 60 * 1000,
    
    /**
     * Always verify passwords for consistency
     */
    verifyPasswords: true
  },
  
  /**
   * Integration settings
   */
  integrations: {
    /**
     * Which mock integrations are enabled - simplified for demo
     */
    enabled: {
      googleDrive: true,
      googleCalendar: true, // Show all integrations for demo
      googleTasks: true,
      currentRMS: true
    },
    
    /**
     * Connection status simulation
     */
    connectionStatus: {
      simulateDisconnections: false,
      reconnectDelay: 2000
    }
  },
  
  /**
   * Helper method to simulate a random operation failure
   * @returns Promise that rejects randomly based on failure rate
   */
  maybeFailRandomly: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (wireframeConfig.simulateFailures && Math.random() < wireframeConfig.failureRate) {
        reject(new Error('Simulated random failure'));
      } else {
        resolve();
      }
    });
  },
  
  /**
   * Helper method to add a realistic delay to operations
   * @param ms Optional custom delay in milliseconds
   * @returns Promise that resolves after the delay
   */
  delay: (ms?: number): Promise<void> => {
    const delayTime = ms ?? wireframeConfig.defaultDelay;
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }
};

// Re-export for backward compatibility if any code is still using these old exports
export const WIREFRAME_MODE = true;
export const MOCK_DELAY_MS = wireframeConfig.defaultDelay;
export const MOCK_AUTH_PERSISTENCE = wireframeConfig.persistAuth;
export const MOCK_FAILURES = wireframeConfig.simulateFailures;
export const MOCK_FAILURE_RATE = wireframeConfig.failureRate;

export default wireframeConfig;
