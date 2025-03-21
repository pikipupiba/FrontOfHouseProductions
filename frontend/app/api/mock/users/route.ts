/**
 * Mock API Route for User Data
 * 
 * This route handles user data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { mockUsers, MockUser } from '@/lib/mock/data/users';
import wireframeConfig from '@/lib/mock/config';

// Create mock users data service
const usersService = createMockDataService<MockUser>(
  mockUsers,
  'User'
);

/**
 * GET handler for user data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const roleType = searchParams.get('roleType');
    const searchQuery = searchParams.get('search');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof MockUser | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (roleType) {
      filters.role = roleType;
    }
    
    // Use search hook if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchResults = await usersService.search(
        searchQuery,
        ['firstName', 'lastName', 'email', 'companyName']
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // Get users with optional filtering, sorting, and pagination
    const result = await usersService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in users API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create new user
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new user
    const newUser = await usersService.create(data);
    
    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific user items by ID
 */
export class UserRoute {
  /**
   * GET handler to fetch a specific user by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get user by ID
      const user = await usersService.getById(id);
      
      return NextResponse.json({ data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch user' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific user
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update user
      const updatedUser = await usersService.update(id, data);
      
      return NextResponse.json({ data: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update user' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific user
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete user
      await usersService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'User deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete user' },
        { status: 500 }
      );
    }
  }
}
