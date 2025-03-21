/**
 * Mock Google Workspace adapter for wireframe demonstration
 * Implements the BaseAdapter interface with simulated data and behavior
 */

import { BaseAdapter } from '@/lib/integrations/core/baseadapter';
import { 
  AuthResult, 
  AuthStatus,
  FetchOptions, 
  IntegrationError,
  IntegrationErrorType,
  QueryOptions, 
  ServiceCapabilities, 
  ServiceCredentials,
  SyncOptions, 
  SyncResult 
} from '@/lib/integrations/core/types';
import wireframeConfig from '@/lib/mock/config';

// Mock Google Workspace resources
interface GoogleWorkspaceResource {
  id: string;
  [key: string]: any;
}

// Calendar events
interface CalendarEvent extends GoogleWorkspaceResource {
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
  creator: { email: string; displayName?: string };
  organizer: { email: string; displayName?: string };
  status: 'confirmed' | 'tentative' | 'cancelled';
  created: string;
  updated: string;
}

// Drive files
interface DriveFile extends GoogleWorkspaceResource {
  name: string;
  mimeType: string;
  description?: string;
  starred?: boolean;
  trashed?: boolean;
  parents?: string[];
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  fileExtension?: string;
  owners: { displayName: string; emailAddress: string }[];
  shared: boolean;
}

// Tasks
interface Task extends GoogleWorkspaceResource {
  title: string;
  notes?: string;
  due?: string;
  completed?: string;
  status: 'needsAction' | 'completed';
  position?: string;
  hidden: boolean;
  deleted: boolean;
  updated: string;
}

// Sample Data
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    summary: 'Annual Corporate Conference',
    description: 'Setup and run annual tech conference for ABC Events',
    location: 'Chicago Convention Center',
    start: { dateTime: '2025-04-10T09:00:00-05:00', timeZone: 'America/Chicago' },
    end: { dateTime: '2025-04-10T17:00:00-05:00', timeZone: 'America/Chicago' },
    attendees: [
      { email: 'manager@example.com', displayName: 'Jordan Manager', responseStatus: 'accepted' },
      { email: 'employee@example.com', displayName: 'Taylor Employee', responseStatus: 'accepted' },
      { email: 'customer@example.com', displayName: 'Alex Customer', responseStatus: 'accepted' }
    ],
    creator: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    organizer: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    status: 'confirmed',
    created: '2025-03-01T10:30:00-05:00',
    updated: '2025-03-10T14:15:00-05:00'
  },
  {
    id: 'event-2',
    summary: 'Equipment Maintenance',
    description: 'Regularly scheduled maintenance for sound equipment',
    location: 'Warehouse',
    start: { dateTime: '2025-03-21T13:00:00-05:00', timeZone: 'America/Chicago' },
    end: { dateTime: '2025-03-21T16:00:00-05:00', timeZone: 'America/Chicago' },
    attendees: [
      { email: 'employee@example.com', displayName: 'Taylor Employee', responseStatus: 'accepted' }
    ],
    creator: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    organizer: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    status: 'confirmed',
    created: '2025-03-15T09:20:00-05:00',
    updated: '2025-03-15T09:20:00-05:00'
  },
  {
    id: 'event-3',
    summary: 'Client Meeting - XYZ Productions',
    description: 'Discuss upcoming theatrical production needs',
    location: 'Virtual Meeting',
    start: { dateTime: '2025-03-23T10:00:00-05:00', timeZone: 'America/Chicago' },
    end: { dateTime: '2025-03-23T11:00:00-05:00', timeZone: 'America/Chicago' },
    attendees: [
      { email: 'manager@example.com', displayName: 'Jordan Manager', responseStatus: 'accepted' },
      { email: 'customer2@example.com', displayName: 'Riley Client', responseStatus: 'accepted' }
    ],
    creator: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    organizer: { email: 'manager@example.com', displayName: 'Jordan Manager' },
    status: 'confirmed',
    created: '2025-03-16T11:45:00-05:00',
    updated: '2025-03-16T11:45:00-05:00'
  }
];

const mockDriveFiles: DriveFile[] = [
  {
    id: 'file-1',
    name: 'Event Contract - ABC Events.pdf',
    mimeType: 'application/pdf',
    description: 'Signed contract for the annual corporate conference',
    starred: true,
    trashed: false,
    parents: ['folder-contracts'],
    webViewLink: 'https://drive.example.com/view/file-1',
    iconLink: 'https://drive.example.com/icons/pdf',
    thumbnailLink: 'https://drive.example.com/thumbnails/file-1',
    createdTime: '2025-03-02T15:30:00-05:00',
    modifiedTime: '2025-03-02T15:30:00-05:00',
    size: '2400000',
    fileExtension: 'pdf',
    owners: [{ displayName: 'Jordan Manager', emailAddress: 'manager@example.com' }],
    shared: true
  },
  {
    id: 'file-2',
    name: 'Production Equipment List.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Inventory list for upcoming events',
    starred: false,
    trashed: false,
    parents: ['folder-inventory'],
    webViewLink: 'https://drive.example.com/view/file-2',
    iconLink: 'https://drive.example.com/icons/spreadsheet',
    thumbnailLink: 'https://drive.example.com/thumbnails/file-2',
    createdTime: '2025-03-05T09:15:00-05:00',
    modifiedTime: '2025-03-18T11:30:00-05:00',
    size: '1500000',
    fileExtension: 'xlsx',
    owners: [{ displayName: 'Taylor Employee', emailAddress: 'employee@example.com' }],
    shared: true
  },
  {
    id: 'file-3',
    name: 'Stage Plot - XYZ Productions.dwg',
    mimeType: 'application/x-autocad',
    description: 'CAD drawing of stage setup for theatrical production',
    starred: false,
    trashed: false,
    parents: ['folder-stage-plots'],
    webViewLink: 'https://drive.example.com/view/file-3',
    iconLink: 'https://drive.example.com/icons/cad',
    thumbnailLink: 'https://drive.example.com/thumbnails/file-3',
    createdTime: '2025-03-17T13:45:00-05:00',
    modifiedTime: '2025-03-17T13:45:00-05:00',
    size: '3800000',
    fileExtension: 'dwg',
    owners: [{ displayName: 'Casey Technician', emailAddress: 'employee2@example.com' }],
    shared: true
  }
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Confirm equipment list with ABC Events',
    notes: 'Need final approval on the equipment list before placing rentals on hold',
    due: '2025-03-25T17:00:00-05:00',
    status: 'needsAction',
    position: '1',
    hidden: false,
    deleted: false,
    updated: '2025-03-19T10:30:00-05:00'
  },
  {
    id: 'task-2',
    title: 'Schedule maintenance for PA systems',
    notes: 'All PA systems need testing before the convention center event',
    due: '2025-03-22T17:00:00-05:00',
    status: 'needsAction',
    position: '2',
    hidden: false,
    deleted: false,
    updated: '2025-03-17T09:15:00-05:00'
  },
  {
    id: 'task-3',
    title: 'Create invoice for XYZ Productions',
    notes: 'Include equipment rental and labor costs',
    due: '2025-03-20T17:00:00-05:00',
    status: 'completed',
    completed: '2025-03-19T15:30:00-05:00',
    position: '3',
    hidden: false,
    deleted: false,
    updated: '2025-03-19T15:30:00-05:00'
  }
];

/**
 * Mock Google Workspace adapter for the wireframe implementation
 */
export class GoogleWorkspaceAdapter extends BaseAdapter {
  // Track authentication status
  private isAuthenticated: boolean = false;
  private authExpiresAt: Date | null = null;
  
  constructor() {
    super('Google Workspace');
    this.loadAuthState();
  }
  
  /**
   * Load authentication state from localStorage
   */
  private loadAuthState(): void {
    try {
      const authState = localStorage.getItem('googleWorkspaceAuthState');
      if (authState) {
        const parsed = JSON.parse(authState);
        this.isAuthenticated = parsed.isAuthenticated;
        this.authExpiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : null;
        
        // Check if auth has expired
        if (this.authExpiresAt && new Date() > this.authExpiresAt) {
          this.isAuthenticated = false;
          this.authExpiresAt = null;
          // Clean up expired auth
          localStorage.removeItem('googleWorkspaceAuthState');
        }
      }
    } catch (error) {
      console.error('Error loading Google Workspace auth state:', error);
      this.isAuthenticated = false;
      this.authExpiresAt = null;
    }
  }
  
  /**
   * Save authentication state to localStorage
   */
  private saveAuthState(): void {
    try {
      localStorage.setItem('googleWorkspaceAuthState', JSON.stringify({
        isAuthenticated: this.isAuthenticated,
        expiresAt: this.authExpiresAt
      }));
    } catch (error) {
      console.error('Error saving Google Workspace auth state:', error);
    }
  }
  
  /**
   * Fetch a single resource by ID
   */
  async fetchResource<T>(
    resourceType: string, 
    id: string, 
    options?: FetchOptions
  ): Promise<T> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(600);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Return appropriate mock data based on resource type
    switch (resourceType) {
      case 'calendarEvents':
        const event = mockCalendarEvents.find(e => e.id === id);
        if (!event) {
          throw this.createError(
            { message: `Event with ID ${id} not found` },
            'fetchResource'
          );
        }
        return event as unknown as T;
        
      case 'driveFiles':
        const file = mockDriveFiles.find(f => f.id === id);
        if (!file) {
          throw this.createError(
            { message: `File with ID ${id} not found` },
            'fetchResource'
          );
        }
        return file as unknown as T;
        
      case 'tasks':
        const task = mockTasks.find(t => t.id === id);
        if (!task) {
          throw this.createError(
            { message: `Task with ID ${id} not found` },
            'fetchResource'
          );
        }
        return task as unknown as T;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'fetchResource'
        );
    }
  }
  
  /**
   * Fetch multiple resources based on query options
   */
  async fetchResources<T>(
    resourceType: string, 
    query: QueryOptions
  ): Promise<T[]> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(800);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Get appropriate mock data based on resource type
    let resources: GoogleWorkspaceResource[] = [];
    
    switch (resourceType) {
      case 'calendarEvents':
        resources = mockCalendarEvents;
        break;
        
      case 'driveFiles':
        resources = mockDriveFiles;
        break;
        
      case 'tasks':
        resources = mockTasks;
        break;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'fetchResources'
        );
    }
    
    // Apply filters if provided
    if (query.filters) {
      resources = resources.filter(resource => {
        return Object.entries(query.filters || {}).every(([key, value]) => {
          // Handle nested properties
          if (key.includes('.')) {
            const parts = key.split('.');
            
            // Safely handle nested properties
            if (parts.length >= 2) {
              const parentKey = parts[0];
              const childKey = parts[1];
              
              // Check if the parent property exists
              if (
                parentKey && 
                childKey && 
                parentKey in resource && 
                resource[parentKey] !== null && 
                typeof resource[parentKey] === 'object'
              ) {
                // Type-safe check for child property
                const parent = resource[parentKey] as Record<string, any>;
                return childKey in parent && parent[childKey] === value;
              }
              
              return false;
            }
            
            return false;
          }
          
          // Direct property comparison (type-safe)
          return typeof key === 'string' && key in resource && resource[key] === value;
        });
      });
    }
    
    // Apply sorting if provided
    if (query.sort && query.sort.length > 0) {
      resources.sort((a, b) => {
        for (const { field, direction } of query.sort || []) {
          const aVal = a[field];
          const bVal = b[field];
          
          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Apply pagination if provided
    if (query.limit !== undefined) {
      const offset = query.offset || 0;
      resources = resources.slice(offset, offset + query.limit);
    }
    
    return resources as unknown as T[];
  }
  
  /**
   * Create a new resource
   */
  async createResource<T>(
    resourceType: string, 
    data: any
  ): Promise<T> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(700);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Generate an ID for the new resource
    const id = `${resourceType.slice(0, -1)}-${Date.now()}`;
    
    // Create the new resource with common fields
    const now = new Date().toISOString();
    const newResource = {
      id,
      ...data,
    };
    
    // Add resource-specific fields
    switch (resourceType) {
      case 'calendarEvents':
        (newResource as CalendarEvent).created = now;
        (newResource as CalendarEvent).updated = now;
        // Save to our mock data
        mockCalendarEvents.push(newResource as CalendarEvent);
        break;
        
      case 'driveFiles':
        (newResource as DriveFile).createdTime = now;
        (newResource as DriveFile).modifiedTime = now;
        // Save to our mock data
        mockDriveFiles.push(newResource as DriveFile);
        break;
        
      case 'tasks':
        (newResource as Task).updated = now;
        // Save to our mock data
        mockTasks.push(newResource as Task);
        break;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'createResource'
        );
    }
    
    return newResource as T;
  }
  
  /**
   * Update an existing resource
   */
  async updateResource<T>(
    resourceType: string, 
    id: string, 
    data: any
  ): Promise<T> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(600);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Find and update the resource
    let updatedResource: GoogleWorkspaceResource | undefined;
    const now = new Date().toISOString();
    
    switch (resourceType) {
      case 'calendarEvents':
        const eventIndex = mockCalendarEvents.findIndex(e => e.id === id);
        if (eventIndex === -1) {
          throw this.createError(
            { message: `Event with ID ${id} not found` },
            'updateResource'
          );
        }
        
        // Update the event with the new data and update timestamp
        updatedResource = {
          ...mockCalendarEvents[eventIndex],
          ...data,
          updated: now
        };
        
        mockCalendarEvents[eventIndex] = updatedResource as CalendarEvent;
        break;
        
      case 'driveFiles':
        const fileIndex = mockDriveFiles.findIndex(f => f.id === id);
        if (fileIndex === -1) {
          throw this.createError(
            { message: `File with ID ${id} not found` },
            'updateResource'
          );
        }
        
        // Update the file with the new data and update timestamp
        updatedResource = {
          ...mockDriveFiles[fileIndex],
          ...data,
          modifiedTime: now
        };
        
        mockDriveFiles[fileIndex] = updatedResource as DriveFile;
        break;
        
      case 'tasks':
        const taskIndex = mockTasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          throw this.createError(
            { message: `Task with ID ${id} not found` },
            'updateResource'
          );
        }
        
        // Update the task with the new data and update timestamp
        updatedResource = {
          ...mockTasks[taskIndex],
          ...data,
          updated: now
        };
        
        mockTasks[taskIndex] = updatedResource as Task;
        break;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'updateResource'
        );
    }
    
    return updatedResource as T;
  }
  
  /**
   * Delete a resource
   */
  async deleteResource(
    resourceType: string, 
    id: string
  ): Promise<void> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(500);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Find and delete the resource
    switch (resourceType) {
      case 'calendarEvents':
        const eventIndex = mockCalendarEvents.findIndex(e => e.id === id);
        if (eventIndex === -1) {
          throw this.createError(
            { message: `Event with ID ${id} not found` },
            'deleteResource'
          );
        }
        
        mockCalendarEvents.splice(eventIndex, 1);
        break;
        
      case 'driveFiles':
        const fileIndex = mockDriveFiles.findIndex(f => f.id === id);
        if (fileIndex === -1) {
          throw this.createError(
            { message: `File with ID ${id} not found` },
            'deleteResource'
          );
        }
        
        mockDriveFiles.splice(fileIndex, 1);
        break;
        
      case 'tasks':
        const taskIndex = mockTasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          throw this.createError(
            { message: `Task with ID ${id} not found` },
            'deleteResource'
          );
        }
        
        mockTasks.splice(taskIndex, 1);
        break;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'deleteResource'
        );
    }
  }
  
  /**
   * Synchronize external data to local cache
   */
  async syncToCache(
    resourceType: string, 
    options?: SyncOptions
  ): Promise<SyncResult> {
    // Check authentication
    await this.ensureAuthenticated();
    
    // Simulate network delay
    await wireframeConfig.delay(1500);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Simulate sync process
    let recordsProcessed = 0;
    
    switch (resourceType) {
      case 'calendarEvents':
        recordsProcessed = mockCalendarEvents.length;
        break;
        
      case 'driveFiles':
        recordsProcessed = mockDriveFiles.length;
        break;
        
      case 'tasks':
        recordsProcessed = mockTasks.length;
        break;
        
      default:
        throw this.createError(
          { message: `Resource type ${resourceType} not supported` },
          'syncToCache'
        );
    }
    
    // Return sync result
    return {
      successful: true,
      resourceType,
      recordsProcessed,
      recordsFailed: 0,
      errors: [],
      timestamp: new Date(),
      duration: 1500,
      fullSync: options?.fullSync || false
    };
  }
  
  /**
   * Invalidate cached data
   */
  async invalidateCache(
    resourceType: string, 
    id?: string
  ): Promise<void> {
    // Simulate network delay
    await wireframeConfig.delay(300);
    
    // In a real implementation, this would clear cache entries
    console.log(`Cache invalidated for ${resourceType}${id ? ` with ID ${id}` : ''}`);
  }
  
  /**
   * Get a resource from cache
   */
  async getCachedResource<T>(
    resourceType: string, 
    id: string
  ): Promise<T> {
    // Simulate a faster response from cache
    await wireframeConfig.delay(200);
    
    // Use the same implementation as fetchResource for the wireframe version
    // In a real implementation, this would check the cache first
    return await this.fetchResource(resourceType, id);
  }
  
  /**
   * Get multiple resources from cache based on query
   */
  async getCachedResources<T>(
    resourceType: string, 
    query: QueryOptions
  ): Promise<T[]> {
    // Simulate a faster response from cache
    await wireframeConfig.delay(300);
    
    // Use the same implementation as fetchResources for the wireframe version
    // In a real implementation, this would check the cache first
    return await this.fetchResources(resourceType, query);
  }
  
  /**
   * Authenticate with the service
   */
  async authenticate(): Promise<AuthResult> {
    // Simulate network delay for OAuth flow
    await wireframeConfig.delay(1200);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Set authentication state
    this.isAuthenticated = true;
    
    // Set expiration for 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    this.authExpiresAt = expiresAt;
    
    // Save auth state
    this.saveAuthState();
    
    return {
      isAuthenticated: true,
      expiresAt: this.authExpiresAt
    };
  }
  
  /**
   * Refresh authentication tokens
   */
  async refreshAuthentication(): Promise<AuthResult> {
    // Simulate network delay
    await wireframeConfig.delay(800);
    
    // Maybe fail randomly
    await wireframeConfig.maybeFailRandomly();
    
    // Check if already authenticated
    if (!this.isAuthenticated) {
      throw this.createError(
        { message: 'Not authenticated, cannot refresh' },
        'refreshAuthentication'
      );
    }
    
    // Set expiration for 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    this.authExpiresAt = expiresAt;
    
    // Save auth state
    this.saveAuthState();
    
    return {
      isAuthenticated: true,
      expiresAt: this.authExpiresAt
    };
  }
  
  /**
   * Check authentication status
   */
  async checkAuthStatus(): Promise<AuthStatus> {
    // Simulate network delay
    await wireframeConfig.delay(300);
    
    // Refresh the authentication state from localStorage
    this.loadAuthState();
    
    return {
      isAuthenticated: this.isAuthenticated,
      expiresAt: this.authExpiresAt || undefined
    };
  }
  
  /**
   * Get the capabilities of this service
   */
  getServiceCapabilities(): ServiceCapabilities {
    return {
      resources: ['calendarEvents', 'driveFiles', 'tasks'],
      operations: {
        calendarEvents: ['read', 'create', 'update', 'delete'],
        driveFiles: ['read', 'create', 'update', 'delete'],
        tasks: ['read', 'create', 'update', 'delete']
      },
      features: ['calendar', 'drive', 'tasks']
    };
  }
  
  /**
   * Ensure the adapter is authenticated
   * @throws IntegrationError if not authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    // Refresh the authentication state from localStorage
    this.loadAuthState();
    
    if (!this.isAuthenticated) {
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: 'Not authenticated with Google Workspace',
        serviceName: this.getServiceName(),
        retryable: false
      });
    }
    
    // If token will expire in the next 5 minutes, refresh it
    if (this.authExpiresAt) {
      const fiveMinutesFromNow = new Date();
      fiveMinutesFromNow.setMinutes(fiveMinutesFromNow.getMinutes() + 5);
      
      if (this.authExpiresAt < fiveMinutesFromNow) {
        await this.refreshAuthentication();
      }
    }
  }
}
