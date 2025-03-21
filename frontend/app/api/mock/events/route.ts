/**
 * Mock API Route for Event Data
 * 
 * This route handles event data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { mockEvents, Event } from '@/lib/mock/data/events';
import wireframeConfig from '@/lib/mock/config';

// Create mock events data service
const eventsService = createMockDataService<Event>(
  mockEvents,
  'Event'
);

/**
 * GET handler for event data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const venueId = searchParams.get('venueId');
    const customerId = searchParams.get('customerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const searchQuery = searchParams.get('search');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof Event | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (venueId) {
      filters.venueId = venueId;
    }
    if (customerId) {
      filters.customerId = customerId;
    }
    
    // Date range filtering (handled specially)
    // This would be better done in a database query
    let filteredByDate = [...mockEvents];
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      
      filteredByDate = mockEvents.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        
        // Event starts within range or ends within range or spans the entire range
        return (eventStart >= start && eventStart <= end) || 
               (eventEnd >= start && eventEnd <= end) ||
               (eventStart <= start && eventEnd >= end);
      });
    }
    
    // Use search hook if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchResults = await eventsService.search(
        searchQuery,
        ['name', 'description', 'id', 'status']
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // If we filtered by date, we need to handle it differently
    // This is hacky and in a real implementation would be done better
    if (startDate || endDate) {
      const customService = createMockDataService<Event>(
        filteredByDate,
        'Event'
      );
      
      const result = await customService.getAll({
        filters,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || 'asc',
        page,
        pageSize
      });
      
      return NextResponse.json(result);
    }
    
    // Get events with optional filtering, sorting, and pagination
    const result = await eventsService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in events API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new event
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new event
    const newEvent = await eventsService.create(data);
    
    return NextResponse.json({ data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create event' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific event items by ID
 */
export class EventRoute {
  /**
   * GET handler to fetch a specific event by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get event by ID
      const event = await eventsService.getById(id);
      
      return NextResponse.json({ data: event });
    } catch (error) {
      console.error('Error fetching event:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch event' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific event
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update event
      const updatedEvent = await eventsService.update(id, data);
      
      return NextResponse.json({ data: updatedEvent });
    } catch (error) {
      console.error('Error updating event:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update event' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific event
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete event
      await eventsService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'Event deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting event:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete event' },
        { status: 500 }
      );
    }
  }
}
