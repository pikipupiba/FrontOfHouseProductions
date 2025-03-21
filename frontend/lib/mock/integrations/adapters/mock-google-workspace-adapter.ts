/**
 * Mock Google Workspace Adapter
 * 
 * This adapter provides a mock implementation of the Google Workspace integration
 * using static mock data instead of real API calls.
 */

import { 
  GoogleDriveFile, 
  GoogleDriveFolder,
  getChildFolders,
  getFilesInFolder,
  getRootFolders,
  searchDriveItems,
  getFileById,
  getFolderById
} from '@/lib/mock/data/integrations/google-drive';
import { ConnectionStatus } from '../mock-integration-manager';

/**
 * Interface for the Google Drive service operations
 */
export interface GoogleDriveService {
  listFiles(folderId?: string): Promise<GoogleDriveFile[]>;
  listFolders(parentId?: string): Promise<GoogleDriveFolder[]>;
  getFile(fileId: string): Promise<GoogleDriveFile>;
  getFolder(folderId: string): Promise<GoogleDriveFolder>;
  searchItems(query: string): Promise<(GoogleDriveFile | GoogleDriveFolder)[]>;
}

/**
 * Interface for Google Calendar service operations (simplified/placeholder)
 */
export interface GoogleCalendarService {
  getConnectionStatus(): ConnectionStatus;
}

/**
 * Interface for Google Tasks service operations (simplified/placeholder)
 */
export interface GoogleTasksService {
  getConnectionStatus(): ConnectionStatus;
}

/**
 * Interface for Google Workspace adapter including all services
 */
export interface GoogleWorkspaceAdapter {
  getConnectionStatus(): ConnectionStatus;
  isConnected(): boolean;
  connect(): Promise<ConnectionStatus>;
  disconnect(): Promise<void>;
  drive: GoogleDriveService;
  calendar: GoogleCalendarService;
  tasks: GoogleTasksService;
}

/**
 * Mock implementation of the Google Drive service
 */
class MockGoogleDriveService implements GoogleDriveService {
  /**
   * List files in a folder
   */
  async listFiles(folderId?: string): Promise<GoogleDriveFile[]> {
    // Simulate network delay
    await this.delay();
    
    if (!folderId) {
      // Return files in root folders (combine all top-level files)
      const rootFolders = getRootFolders();
      let allFiles: GoogleDriveFile[] = [];
      
      for (const folder of rootFolders) {
        const files = getFilesInFolder(folder.id);
        allFiles = [...allFiles, ...files];
      }
      
      return allFiles;
    }
    
    // Return files in specific folder
    return getFilesInFolder(folderId);
  }
  
  /**
   * List folders 
   */
  async listFolders(parentId?: string): Promise<GoogleDriveFolder[]> {
    // Simulate network delay
    await this.delay();
    
    if (!parentId) {
      // Return root folders
      return getRootFolders();
    }
    
    // Return child folders
    return getChildFolders(parentId);
  }
  
  /**
   * Get a specific file by ID
   */
  async getFile(fileId: string): Promise<GoogleDriveFile> {
    // Simulate network delay
    await this.delay();
    
    const file = getFileById(fileId);
    
    if (!file) {
      throw new Error(`File ${fileId} not found`);
    }
    
    return file;
  }
  
  /**
   * Get a specific folder by ID
   */
  async getFolder(folderId: string): Promise<GoogleDriveFolder> {
    // Simulate network delay
    await this.delay();
    
    const folder = getFolderById(folderId);
    
    if (!folder) {
      throw new Error(`Folder ${folderId} not found`);
    }
    
    return folder;
  }
  
  /**
   * Search for files and folders
   */
  async searchItems(query: string): Promise<(GoogleDriveFile | GoogleDriveFolder)[]> {
    // Simulate network delay
    await this.delay();
    
    return searchDriveItems(query);
  }
  
  /**
   * Helper method to simulate network delay
   */
  private async delay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Mock implementation of the Google Calendar service (placeholder)
 */
class MockGoogleCalendarService implements GoogleCalendarService {
  getConnectionStatus(): ConnectionStatus {
    return {
      connected: false,
      error: 'Google Calendar integration is temporarily unavailable.',
      lastSyncTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    };
  }
}

/**
 * Mock implementation of the Google Tasks service (placeholder)
 */
class MockGoogleTasksService implements GoogleTasksService {
  getConnectionStatus(): ConnectionStatus {
    return {
      connected: false,
      error: 'Google Tasks integration is temporarily unavailable.',
      lastSyncTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    };
  }
}

/**
 * Mock implementation of the Google Workspace adapter
 */
class MockGoogleWorkspaceAdapter implements GoogleWorkspaceAdapter {
  private _connected = true;
  private _lastSyncTime = new Date().toISOString();
  
  public readonly drive: GoogleDriveService;
  public readonly calendar: GoogleCalendarService;
  public readonly tasks: GoogleTasksService;
  
  constructor() {
    this.drive = new MockGoogleDriveService();
    this.calendar = new MockGoogleCalendarService();
    this.tasks = new MockGoogleTasksService();
  }
  
  /**
   * Get the connection status for the entire Google Workspace integration
   */
  getConnectionStatus(): ConnectionStatus {
    return {
      connected: this._connected,
      lastSyncTime: this._lastSyncTime,
      error: this._connected ? null : 'Not connected to Google Workspace'
    };
  }
  
  /**
   * Check if the adapter is connected
   */
  isConnected(): boolean {
    return this._connected;
  }
  
  /**
   * Connect to Google Workspace (mock implementation)
   */
  async connect(): Promise<ConnectionStatus> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this._connected = true;
    this._lastSyncTime = new Date().toISOString();
    
    return this.getConnectionStatus();
  }
  
  /**
   * Disconnect from Google Workspace
   */
  async disconnect(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    this._connected = false;
  }
}

/**
 * Export singleton instance
 */
export const mockGoogleWorkspaceAdapter = new MockGoogleWorkspaceAdapter();
