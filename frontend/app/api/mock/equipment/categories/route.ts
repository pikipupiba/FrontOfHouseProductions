/**
 * Mock API Route for Equipment Categories
 * 
 * This route provides mock equipment categories data for the wireframe implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockEquipmentCategories } from '@/lib/mock/data/equipment';
import wireframeConfig from '@/lib/mock/config';

/**
 * GET handler for equipment categories
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate potential random failures
    await wireframeConfig.maybeFailRandomly();
    
    // Simulate network delay
    await wireframeConfig.delay();
    
    // Return the mock equipment categories
    return NextResponse.json({
      data: mockEquipmentCategories,
      count: mockEquipmentCategories.length
    });
  } catch (error) {
    console.error('Error in equipment categories API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
