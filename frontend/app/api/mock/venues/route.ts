/**
 * Mock API Route for Venue Data
 * 
 * This route handles venue data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database connections.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { mockVenues, Venue, VenueType } from '@/lib/mock/data/venues';
import wireframeConfig from '@/lib/mock/config';

// Create mock venues data service
const venuesService = createMockDataService<Venue>(
  mockVenues,
  'Venue'
);

/**
 * GET handler for venue data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const venueType = searchParams.get('venueType') as VenueType | null;
    const minCapacity = searchParams.get('minCapacity');
    const featured = searchParams.get('featured');
    const city = searchParams.get('city');
    const searchQuery = searchParams.get('search');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof Venue | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (venueType) {
      filters.venueType = venueType;
    }
    if (city) {
      filters.city = city;
    }
    if (featured) {
      filters.featured = featured === 'true';
    }
    
    // Capacity filtering (handled specially)
    let filteredByCapacity = [...mockVenues];
    if (minCapacity) {
      const minCapacityNum = parseInt(minCapacity);
      filteredByCapacity = mockVenues.filter(venue => 
        venue.capacity.seated >= minCapacityNum
      );
    }
    
    // Use search hook if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchResults = await venuesService.search(
        searchQuery,
        ['name', 'description', 'address', 'city', 'state']
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // If we filtered by capacity, we need to handle it differently
    if (minCapacity) {
      const customService = createMockDataService<Venue>(
        filteredByCapacity,
        'Venue'
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
    
    // Get venues with optional filtering, sorting, and pagination
    const result = await venuesService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in venues API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new venue
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new venue
    const newVenue = await venuesService.create(data);
    
    return NextResponse.json({ data: newVenue }, { status: 201 });
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create venue' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific venue items by ID
 */
export class VenueRoute {
  /**
   * GET handler to fetch a specific venue by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get venue by ID
      const venue = await venuesService.getById(id);
      
      return NextResponse.json({ data: venue });
    } catch (error) {
      console.error('Error fetching venue:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Venue not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch venue' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific venue
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update venue
      const updatedVenue = await venuesService.update(id, data);
      
      return NextResponse.json({ data: updatedVenue });
    } catch (error) {
      console.error('Error updating venue:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Venue not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update venue' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific venue
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete venue
      await venuesService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'Venue deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting venue:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Venue not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete venue' },
        { status: 500 }
      );
    }
  }
}
