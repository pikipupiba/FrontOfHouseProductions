/**
 * Mock API Route for Equipment Data
 * 
 * This route handles equipment data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { Equipment, mockEquipment } from '@/lib/mock/data/equipment';
import wireframeConfig from '@/lib/mock/config';

// Create mock equipment data service
const equipmentService = createMockDataService<Equipment>(
  mockEquipment,
  'Equipment'
);

/**
 * GET handler for equipment data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const searchQuery = searchParams.get('search');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof Equipment | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    
    // Use search hook if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchResults = await equipmentService.search(
        searchQuery,
        ['name', 'description', 'manufacturer', 'model']
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // Get equipment with optional filtering, sorting, and pagination
    const result = await equipmentService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in equipment API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create new equipment
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new equipment
    const newEquipment = await equipmentService.create(data);
    
    return NextResponse.json({ data: newEquipment }, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create equipment' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific equipment items by ID
 */
export class EquipmentRoute {
  /**
   * GET handler to fetch a specific equipment by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get equipment by ID
      const equipment = await equipmentService.getById(id);
      
      return NextResponse.json({ data: equipment });
    } catch (error) {
      console.error('Error fetching equipment:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Equipment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch equipment' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific equipment
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update equipment
      const updatedEquipment = await equipmentService.update(id, data);
      
      return NextResponse.json({ data: updatedEquipment });
    } catch (error) {
      console.error('Error updating equipment:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Equipment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update equipment' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific equipment
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete equipment
      await equipmentService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'Equipment deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting equipment:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Equipment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete equipment' },
        { status: 500 }
      );
    }
  }
}
