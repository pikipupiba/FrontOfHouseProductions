/**
 * Mock API Route for Rental Data
 * 
 * This route handles rental data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database connections.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { mockRentals, Rental } from '@/lib/mock/data/rentals';
import wireframeConfig from '@/lib/mock/config';

// Create mock rentals data service
const rentalsService = createMockDataService<Rental>(
  mockRentals,
  'Rental'
);

/**
 * GET handler for rental data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const searchQuery = searchParams.get('search');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof Rental | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (customerId) {
      filters.customerId = customerId;
    }
    if (status) {
      filters.status = status;
    }
    
    // Date range filtering (handled specially)
    // This would be better done in a database query
    let filteredByDate = [...mockRentals];
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      
      filteredByDate = mockRentals.filter(rental => {
        const rentalStart = new Date(rental.startDate);
        const rentalEnd = new Date(rental.endDate);
        
        // Rental starts within range or ends within range or spans the entire range
        return (rentalStart >= start && rentalStart <= end) || 
               (rentalEnd >= start && rentalEnd <= end) ||
               (rentalStart <= start && rentalEnd >= end);
      });
    }
    
    // Use search hook if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchResults = await rentalsService.search(
        searchQuery,
        ['eventName', 'eventDescription', 'venueName', 'contactName']
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // If we filtered by date, we need to handle it differently
    // This is hacky and in a real implementation would be done better
    if (startDate || endDate) {
      const customService = createMockDataService<Rental>(
        filteredByDate,
        'Rental'
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
    
    // Get rentals with optional filtering, sorting, and pagination
    const result = await rentalsService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in rentals API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new rental
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new rental
    const newRental = await rentalsService.create(data);
    
    return NextResponse.json({ data: newRental }, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create rental' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific rental items by ID
 */
export class RentalRoute {
  /**
   * GET handler to fetch a specific rental by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get rental by ID
      const rental = await rentalsService.getById(id);
      
      return NextResponse.json({ data: rental });
    } catch (error) {
      console.error('Error fetching rental:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Rental not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch rental' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific rental
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update rental
      const updatedRental = await rentalsService.update(id, data);
      
      return NextResponse.json({ data: updatedRental });
    } catch (error) {
      console.error('Error updating rental:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Rental not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update rental' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific rental
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete rental
      await rentalsService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'Rental deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting rental:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Rental not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete rental' },
        { status: 500 }
      );
    }
  }
}
