import { drive_v3, google } from 'googleapis';
import { FetchOptions, QueryOptions, SyncOptions, SyncResult } from '../../../core/types';
import { GoogleWorkspaceAdapter } from '..';

export class DriveService {
  private adapter: GoogleWorkspaceAdapter;
  private driveApi: drive_v3.Drive | null = null;
  
  constructor(adapter: GoogleWorkspaceAdapter) {
    this.adapter = adapter;
  }
  
  /**
   * Get the Drive API client
   */
  private getDriveApi(): drive_v3.Drive {
    if (!this.driveApi) {
      const auth = this.adapter.getOAuth2Client();
      this.driveApi = google.drive({ version: 'v3', auth });
    }
    return this.driveApi;
  }
  
  /**
   * Get a single file by ID
   */
  async getFile(fileId: string, options?: FetchOptions): Promise<drive_v3.Schema$File> {
    const api = this.getDriveApi();
    
    // Convert options to Google Drive params
    const fields = options?.fields?.join(',') || 'id,name,mimeType,webViewLink,thumbnailLink,size,createdTime,modifiedTime,parents';
    
    const response = await api.files.get({
      fileId,
      fields
    });
    
    return response.data;
  }
  
  /**
   * List files and folders
   */
  async listFiles(query: QueryOptions): Promise<drive_v3.Schema$File[]> {
    const api = this.getDriveApi();
    
    // Build query string
    const q = this.buildQueryString(query.filters);
    
    // Convert options to Google Drive params
    const params: drive_v3.Params$Resource$Files$List = {
      q,
      pageSize: query.limit || 100,
      pageToken: query.pageToken as string,
      fields: 'nextPageToken, files(id, name, mimeType, webViewLink, thumbnailLink, size, createdTime, modifiedTime, parents)',
      orderBy: this.buildOrderBy(query.sort)
    };
    
    const response = await api.files.list(params);
    
    return response.data.files || [];
  }
  
  /**
   * Create a new folder
   */
  async createFolder(data: { name: string; parentId?: string }): Promise<drive_v3.Schema$File> {
    const api = this.getDriveApi();
    
    const requestBody: drive_v3.Schema$File = {
      name: data.name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(data.parentId && { parents: [data.parentId] })
    };
    
    const response = await api.files.create({
      requestBody,
      fields: 'id,name,mimeType,webViewLink,thumbnailLink,createdTime,modifiedTime,parents'
    });
    
    return response.data;
  }
  
  /**
   * Create a new file
   */
  async createFile(data: { 
    name: string; 
    content?: string | Buffer; 
    mimeType: string; 
    parentId?: string 
  }): Promise<drive_v3.Schema$File> {
    const api = this.getDriveApi();
    
    const requestBody: drive_v3.Schema$File = {
      name: data.name,
      mimeType: data.mimeType,
      ...(data.parentId && { parents: [data.parentId] })
    };
    
    // If content is provided, use media upload
    if (data.content) {
      const media = {
        mimeType: data.mimeType,
        body: data.content
      };
      
      const response = await api.files.create({
        requestBody,
        media,
        fields: 'id,name,mimeType,webViewLink,thumbnailLink,size,createdTime,modifiedTime,parents'
      });
      
      return response.data;
    } else {
      // Create empty file
      const response = await api.files.create({
        requestBody,
        fields: 'id,name,mimeType,webViewLink,thumbnailLink,size,createdTime,modifiedTime,parents'
      });
      
      return response.data;
    }
  }
  
  /**
   * Update a file
   */
  async updateFile(fileId: string, data: { 
    name?: string; 
    content?: string | Buffer; 
    mimeType?: string;
    addParents?: string;
    removeParents?: string;
  }): Promise<drive_v3.Schema$File> {
    const api = this.getDriveApi();
    
    const requestBody: drive_v3.Schema$File = {};
    
    if (data.name) {
      requestBody.name = data.name;
    }
    
    if (data.mimeType) {
      requestBody.mimeType = data.mimeType;
    }
    
    // Extract non-file properties
    const { content, ...params } = data;
    
    // If content is provided, use media upload
    if (content) {
      const media = {
        mimeType: data.mimeType || 'application/octet-stream',
        body: content
      };
      
      const response = await api.files.update({
        fileId,
        requestBody,
        media,
        addParents: data.addParents,
        removeParents: data.removeParents,
        fields: 'id,name,mimeType,webViewLink,thumbnailLink,size,createdTime,modifiedTime,parents'
      });
      
      return response.data;
    } else {
      // Update metadata only
      const response = await api.files.update({
        fileId,
        requestBody,
        addParents: data.addParents,
        removeParents: data.removeParents,
        fields: 'id,name,mimeType,webViewLink,thumbnailLink,size,createdTime,modifiedTime,parents'
      });
      
      return response.data;
    }
  }
  
  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    const api = this.getDriveApi();
    
    await api.files.delete({
      fileId
    });
  }
  
  /**
   * Sync files to cache
   */
  async syncFiles(options?: SyncOptions): Promise<SyncResult> {
    const startTime = new Date();
    const api = this.getDriveApi();
    
    try {
      // In a real implementation, this would sync files to the database
      // This is a placeholder implementation
      console.log('Syncing Drive files to cache...');
      
      // Initialize counters for sync results
      let recordsProcessed = 0;
      let recordsFailed = 0;
      const errors: Error[] = [];
      
      // Default options
      const syncOptions = {
        fullSync: options?.fullSync || false,
        batchSize: options?.batchSize || 100,
        maxRecords: options?.maxRecords || 1000,
        ...options
      };
      
      // Calculate time based on options
      const updatedTime = syncOptions.sinceDatetime ? 
        `modifiedTime > '${syncOptions.sinceDatetime.toISOString()}'` : '';
      
      // Get files
      const params: drive_v3.Params$Resource$Files$List = {
        pageSize: syncOptions.batchSize,
        // Only include files owned by the user
        q: `'me' in owners ${updatedTime ? 'and ' + updatedTime : ''}`,
        fields: 'nextPageToken, files(id, name, mimeType, webViewLink, thumbnailLink, size, createdTime, modifiedTime, parents)',
        orderBy: 'modifiedTime desc'
      };
      
      // Process files in batches with pagination
      let nextPageToken: string | undefined | null = undefined;
      
      do {
        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }
        
        const response = await api.files.list(params);
        const files = response.data.files || [];
        
        // Process each file - in a real implementation, this would upsert to the database
        for (const file of files) {
          try {
            console.log(`Processing file ${file.id}: ${file.name}`);
            // Here we would upsert the file to the database
            recordsProcessed++;
          } catch (error) {
            console.error(`Failed to process file ${file.id}:`, error);
            recordsFailed++;
            errors.push(error as Error);
          }
          
          // Stop if we've reached the maximum number of records
          if (recordsProcessed + recordsFailed >= syncOptions.maxRecords) {
            break;
          }
        }
        
        nextPageToken = response.data.nextPageToken;
        
        // Stop if we've reached the maximum number of records
        if (recordsProcessed + recordsFailed >= syncOptions.maxRecords) {
          break;
        }
      } while (nextPageToken);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      return {
        successful: errors.length === 0,
        resourceType: 'drive-file',
        recordsProcessed,
        recordsFailed,
        errors,
        timestamp: endTime,
        duration,
        fullSync: syncOptions.fullSync
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      return {
        successful: false,
        resourceType: 'drive-file',
        recordsProcessed: 0,
        recordsFailed: 1,
        errors: [error as Error],
        timestamp: endTime,
        duration,
        fullSync: options?.fullSync || false
      };
    }
  }
  
  /**
   * Build a Google Drive query string from filters
   */
  private buildQueryString(filters?: Record<string, any>): string {
    if (!filters) return '';
    
    const queryParts: string[] = [];
    
    // Handle common filters
    if (filters.name) {
      queryParts.push(`name contains '${filters.name}'`);
    }
    
    if (filters.fullText) {
      queryParts.push(`fullText contains '${filters.fullText}'`);
    }
    
    if (filters.mimeType) {
      if (Array.isArray(filters.mimeType)) {
        const mimeTypes = filters.mimeType.map((type: string) => `mimeType = '${type}'`);
        queryParts.push(`(${mimeTypes.join(' or ')})`);
      } else {
        queryParts.push(`mimeType = '${filters.mimeType}'`);
      }
    }
    
    if (filters.foldersOnly) {
      queryParts.push(`mimeType = 'application/vnd.google-apps.folder'`);
    }
    
    if (filters.filesOnly) {
      queryParts.push(`mimeType != 'application/vnd.google-apps.folder'`);
    }
    
    if (filters.parentId) {
      queryParts.push(`'${filters.parentId}' in parents`);
    }
    
    if (filters.trashed !== undefined) {
      queryParts.push(`trashed = ${filters.trashed}`);
    }
    
    return queryParts.join(' and ');
  }
  
  /**
   * Build orderBy parameter from sort options
   */
  private buildOrderBy(sort?: { field: string; direction: 'asc' | 'desc' }[]): string | undefined {
    if (!sort || sort.length === 0) {
      return undefined;
    }
    
    // Convert field names to Google Drive field names
    const fieldMap: Record<string, string> = {
      name: 'name',
      modifiedTime: 'modifiedTime',
      createdTime: 'createdTime',
      size: 'quotaBytesUsed'
    };
    
    return sort
      .filter(s => fieldMap[s.field]) // Only include supported fields
      .map(s => `${fieldMap[s.field]} ${s.direction === 'desc' ? 'desc' : 'asc'}`)
      .join(', ');
  }
}
