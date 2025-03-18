import { calendar_v3, google } from 'googleapis';
import { FetchOptions, QueryOptions, SyncOptions, SyncResult } from '../../../core/types';
import { GoogleWorkspaceAdapter } from '..';

export class CalendarService {
  private adapter: GoogleWorkspaceAdapter;
  private calendarApi: calendar_v3.Calendar | null = null;
  
  constructor(adapter: GoogleWorkspaceAdapter) {
    this.adapter = adapter;
  }
  
  /**
   * Get the Calendar API client
   */
  private getCalendarApi(): calendar_v3.Calendar {
    if (!this.calendarApi) {
      const auth = this.adapter.getOAuth2Client();
      this.calendarApi = google.calendar({ version: 'v3', auth });
    }
    return this.calendarApi;
  }
  
  /**
   * Get a single calendar event
   */
  async getEvent(eventId: string, options?: FetchOptions): Promise<calendar_v3.Schema$Event> {
    const api = this.getCalendarApi();
    
    // Default to primary calendar if not specified
    const calendarId = options?.calendarId || 'primary';
    
    const response = await api.events.get({
      calendarId,
      eventId,
      ...options
    });
    
    return response.data;
  }
  
  /**
   * List calendar events
   */
  async listEvents(query: QueryOptions): Promise<calendar_v3.Schema$Event[]> {
    const api = this.getCalendarApi();
    
    // Default to primary calendar if not specified
    const calendarId = query.calendarId || 'primary';
    
    // Format parameters for Google Calendar API
    const params: calendar_v3.Params$Resource$Events$List = {
      calendarId,
      maxResults: query.limit || 100,
      singleEvents: true,
      orderBy: 'startTime',
      timeMin: query.timeMin ? new Date(query.timeMin).toISOString() : undefined,
      timeMax: query.timeMax ? new Date(query.timeMax).toISOString() : undefined,
      q: query.q,
      pageToken: query.pageToken
    };
    
    const response = await api.events.list(params);
    
    return response.data.items || [];
  }
  
  /**
   * Create a new calendar event
   */
  async createEvent(eventData: any): Promise<calendar_v3.Schema$Event> {
    const api = this.getCalendarApi();
    
    // Default to primary calendar if not specified
    const calendarId = eventData.calendarId || 'primary';
    
    // Remove non-event properties
    const { calendarId: _, ...eventParams } = eventData;
    
    const response = await api.events.insert({
      calendarId,
      requestBody: eventParams
    });
    
    return response.data;
  }
  
  /**
   * Update an existing calendar event
   */
  async updateEvent(eventId: string, eventData: any): Promise<calendar_v3.Schema$Event> {
    const api = this.getCalendarApi();
    
    // Default to primary calendar if not specified
    const calendarId = eventData.calendarId || 'primary';
    
    // Remove non-event properties
    const { calendarId: _, ...eventParams } = eventData;
    
    const response = await api.events.update({
      calendarId,
      eventId,
      requestBody: eventParams
    });
    
    return response.data;
  }
  
  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string, options?: { calendarId?: string }): Promise<void> {
    const api = this.getCalendarApi();
    
    // Default to primary calendar if not specified
    const calendarId = options?.calendarId || 'primary';
    
    await api.events.delete({
      calendarId,
      eventId
    });
  }
  
  /**
   * Sync calendar events to cache
   */
  async syncEvents(options?: SyncOptions): Promise<SyncResult> {
    const startTime = new Date();
    const api = this.getCalendarApi();
    
    try {
      // In a real implementation, this would sync calendar events to the database
      // This is a placeholder implementation
      console.log('Syncing calendar events to cache...');
      
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
      
      // Calculate time range based on options
      const timeMin = syncOptions.sinceDatetime || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days by default
      
      // Get calendar events
      const params: calendar_v3.Params$Resource$Events$List = {
        calendarId: 'primary',
        maxResults: syncOptions.batchSize,
        singleEvents: true,
        orderBy: 'updated',
        timeMin: timeMin.toISOString(),
        updatedMin: syncOptions.sinceDatetime?.toISOString()
      };
      
      // Process events in batches with pagination
      let nextPageToken: string | undefined | null = undefined;
      
      do {
        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }
        
        const response = await api.events.list(params);
        const events = response.data.items || [];
        
        // Process each event - in a real implementation, this would upsert to the database
        for (const event of events) {
          try {
            console.log(`Processing event ${event.id}: ${event.summary}`);
            // Here we would upsert the event to the database
            recordsProcessed++;
          } catch (error) {
            console.error(`Failed to process event ${event.id}:`, error);
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
        resourceType: 'calendar-event',
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
        resourceType: 'calendar-event',
        recordsProcessed: 0,
        recordsFailed: 1,
        errors: [error as Error],
        timestamp: endTime,
        duration,
        fullSync: options?.fullSync || false
      };
    }
  }
}
