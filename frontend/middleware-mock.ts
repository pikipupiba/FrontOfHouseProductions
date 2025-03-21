/**
 * API Middleware for Wireframe Implementation
 * 
 * This middleware intercepts all API requests and redirects them to mock implementations.
 * In this simplified approach, we've removed the environment variable condition as the
 * wireframe mode is always enabled.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isErrorPath, isPrefetchPath, isStaticPath } from './lib/utils/path-helpers';

// Paths that should be intercepted and redirected to mock implementations
const API_PATHS = [
  '/api/equipment',
  '/api/events',
  '/api/rentals',
  '/api/users',
  '/api/profiles',
  '/api/auth',
  '/api/integrations',
];

/**
 * Middleware to handle API request routing
 * 
 * This middleware intercepts requests to API endpoints and always redirects them
 * to mock implementations.
 */
export function middleware(request: NextRequest) {
  // Skip middleware for static assets, Next.js internals, and error pages
  if (
    isStaticPath(request.nextUrl.pathname) ||
    isPrefetchPath(request.nextUrl.pathname) ||
    isErrorPath(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }
  
  // Check if the request is for an API endpoint
  const isApiRequest = API_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // If this is an API request, redirect to the mock implementation
  if (isApiRequest) {
    // Get the original path and add /mock/ after /api/
    const mockPath = request.nextUrl.pathname.replace('/api/', '/api/mock/');
    
    // Create URL for the mock endpoint, preserving query parameters
    const url = new URL(mockPath, request.url);
    url.search = request.nextUrl.search;
    
    // Redirect to the mock endpoint
    return NextResponse.rewrite(url);
  }
  
  // For all other requests, proceed with normal routing
  return NextResponse.next();
}

/**
 * Configure paths that should be processed by this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
