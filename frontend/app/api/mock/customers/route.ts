/**
 * Mock API Route for Customer Data
 * 
 * This route handles customer data operations (GET, POST, PUT, DELETE)
 * using mock data services instead of real database connections.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMockDataService } from '@/lib/mock/services/mock-data-service';
import { mockCustomers, Customer, CompanyType, CustomerStatus } from '@/lib/mock/data/customers';
import wireframeConfig from '@/lib/mock/config';

// Create mock customers data service
const customersService = createMockDataService<Customer>(
  mockCustomers,
  'Customer'
);

/**
 * GET handler for customer data
 * Supports filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const companyType = searchParams.get('companyType') as CompanyType | null;
    const status = searchParams.get('status') as CustomerStatus | null;
    const assignedRepId = searchParams.get('assignedRepId');
    const userId = searchParams.get('userId');
    const industry = searchParams.get('industry');
    const searchQuery = searchParams.get('search');
    const tag = searchParams.get('tag');
    const pageStr = searchParams.get('page');
    const pageSizeStr = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as keyof Customer | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;
    
    // Parse pagination parameters
    const page = pageStr ? parseInt(pageStr) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr) : undefined;
    
    // Build filter object
    const filters: Record<string, any> = {};
    if (companyType) {
      filters.companyType = companyType;
    }
    if (status) {
      filters.status = status;
    }
    if (assignedRepId) {
      filters.assignedRepId = assignedRepId;
    }
    if (userId) {
      filters.userId = userId;
    }
    if (industry) {
      filters.industry = industry;
    }
    
    // Tag filtering (handled specially)
    let filteredByTag = [...mockCustomers];
    if (tag) {
      filteredByTag = mockCustomers.filter(customer => 
        customer.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Use custom search for customer data if search parameter is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      
      // Manually search across nested properties
      const searchResults = mockCustomers.filter(customer => 
        customer.companyName.toLowerCase().includes(lowerQuery) ||
        customer.primaryContact.name.toLowerCase().includes(lowerQuery) ||
        (customer.primaryContact.email && customer.primaryContact.email.toLowerCase().includes(lowerQuery)) ||
        (customer.industry && customer.industry.toLowerCase().includes(lowerQuery)) ||
        (customer.billingAddress && customer.billingAddress.city.toLowerCase().includes(lowerQuery)) ||
        (customer.billingAddress && customer.billingAddress.state.toLowerCase().includes(lowerQuery))
      );
      
      return NextResponse.json({
        data: searchResults,
        count: searchResults.length
      });
    }
    
    // If we filtered by tag, we need to handle it differently
    if (tag) {
      const customService = createMockDataService<Customer>(
        filteredByTag,
        'Customer'
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
    
    // Get customers with optional filtering, sorting, and pagination
    const result = await customersService.getAll({
      filters,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || 'asc',
      page,
      pageSize
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in customers API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new customer
 */
export async function POST(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Parse request body
    const data = await request.json();
    
    // Create new customer
    const newCustomer = await customersService.create(data);
    
    return NextResponse.json({ data: newCustomer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create customer' },
      { status: 500 }
    );
  }
}

/**
 * Route handling for specific customer items by ID
 */
export class CustomerRoute {
  /**
   * GET handler to fetch a specific customer by ID
   */
  static async GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Get customer by ID
      const customer = await customersService.getById(id);
      
      return NextResponse.json({ data: customer });
    } catch (error) {
      console.error('Error fetching customer:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch customer' },
        { status: 500 }
      );
    }
  }
  
  /**
   * PUT handler to update a specific customer
   */
  static async PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      const data = await request.json();
      
      // Update customer
      const updatedCustomer = await customersService.update(id, data);
      
      return NextResponse.json({ data: updatedCustomer });
    } catch (error) {
      console.error('Error updating customer:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update customer' },
        { status: 500 }
      );
    }
  }
  
  /**
   * DELETE handler to remove a specific customer
   */
  static async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Simulate potential random failures
      await wireframeConfig.maybeFailRandomly();
      
      const { id } = params;
      
      // Delete customer
      await customersService.delete(id);
      
      return NextResponse.json(
        { success: true, message: 'Customer deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting customer:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete customer' },
        { status: 500 }
      );
    }
  }
}
