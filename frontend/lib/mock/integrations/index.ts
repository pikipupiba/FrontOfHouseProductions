/**
 * Factory and exports for mock integration adapters
 */

import { BaseAdapter } from '@/lib/integrations/core/baseadapter';
import { GoogleWorkspaceAdapter } from './google-workspace-adapter';

/**
 * Available mock adapter types
 */
export enum MockAdapterType {
  GOOGLE_WORKSPACE = 'google_workspace',
  CURRENT_RMS = 'current_rms',
  DOCUSIGN = 'docusign'
}

/**
 * Create a mock adapter of the specified type
 * @param type Type of adapter to create
 * @returns A BaseAdapter instance for the specified service
 */
export function createMockAdapter(type: MockAdapterType): BaseAdapter {
  switch (type) {
    case MockAdapterType.GOOGLE_WORKSPACE:
      return new GoogleWorkspaceAdapter();
      
    case MockAdapterType.CURRENT_RMS:
      // Not yet implemented
      throw new Error('Current RMS adapter not yet implemented');
      
    case MockAdapterType.DOCUSIGN:
      // Not yet implemented
      throw new Error('DocuSign adapter not yet implemented');
      
    default:
      throw new Error(`Unknown adapter type: ${type}`);
  }
}

/**
 * Create a Google Workspace mock adapter
 * @returns A configured GoogleWorkspaceAdapter instance
 */
export function createGoogleWorkspaceAdapter(): GoogleWorkspaceAdapter {
  return new GoogleWorkspaceAdapter();
}
