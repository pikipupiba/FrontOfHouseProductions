'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { GoogleWorkspaceAdapter } from '@/lib/mock/integrations/google-workspace-adapter';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
  creator: { email: string; displayName?: string };
  organizer: { email: string; displayName?: string };
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export function MockGoogleCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setLoading(true);
        
        // Create an instance of the GoogleWorkspaceAdapter
        const adapter = new GoogleWorkspaceAdapter();
        
        // Check if we're authenticated
        const authStatus = await adapter.checkAuthStatus();
        
        if (!authStatus.isAuthenticated) {
          setError('Not authenticated with Google Workspace');
          setLoading(false);
          return;
        }
        
        // Fetch calendar events from the mock adapter
        const calendarEvents = await adapter.fetchResources<CalendarEvent>('calendarEvents', {
          filters: {},
          sort: [{ field: 'start.dateTime', direction: 'asc' }]
        });
        
        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        setError('Failed to load calendar events');
        setLoading(false);
      }
    };
    
    fetchCalendarEvents();
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Refreshing the page or reconnecting your Google account may resolve this issue.
        </p>
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">No upcoming events found in your calendar.</p>
        <a 
          href="https://calendar.google.com/calendar/u/0/r/eventedit" 
          target="_blank"
          rel="noopener noreferrer" 
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
        >
          Create an event in Google Calendar →
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{event.summary}</h3>
              <div className="mt-1 text-sm text-gray-500">
                {format(parseISO(event.start.dateTime), 'MMM d, yyyy • h:mm a')} - 
                {format(parseISO(event.end.dateTime), ' h:mm a')}
              </div>
              {event.location && (
                <div className="mt-1 text-sm text-gray-500">
                  <span className="inline-block mr-1">📍</span> {event.location}
                </div>
              )}
              {event.description && (
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </div>
              )}
              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-gray-500 mb-1 block">Attendees:</span>
                  <div className="flex flex-wrap gap-2">
                    {event.attendees.slice(0, 3).map((attendee, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {attendee.displayName || attendee.email}
                      </span>
                    ))}
                    {event.attendees.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                        +{event.attendees.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="ml-4">
              <span 
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  event.status === 'confirmed' 
                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                    : event.status === 'tentative'
                    ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4 border-t border-gray-100">
        <a 
          href="https://calendar.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Calendar in Google →
        </a>
      </div>
    </div>
  );
}
