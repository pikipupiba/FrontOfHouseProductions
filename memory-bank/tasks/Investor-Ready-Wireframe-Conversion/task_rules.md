# Task Rules: Investor-Ready-Wireframe-Conversion

This document outlines the guidelines, constraints, and best practices for implementing the wireframe conversion. These rules ensure that the wireframe maintains visual fidelity and a realistic user experience while simplifying the implementation.

## Core Principles

1. **Preserve Visual Fidelity**: The wireframe must visually match the original application.
2. **Simplify Implementation**: Remove real service dependencies while maintaining the appearance of functionality.
3. **Maintain Type Safety**: Use TypeScript types throughout to ensure consistency.
4. **Simulate Realistic Behavior**: Add delays and occasional errors to simulate real API behavior.
5. **Document Everything**: Ensure all mock implementations are well-documented.

## Implementation Rules

### Configuration

1. ✅ **Direct Configuration**: Use hardcoded configuration values rather than environment variables.
   ```typescript
   // INSTEAD OF
   const isEnabled = process.env.NEXT_PUBLIC_FEATURE_ENABLED === 'true';
   
   // USE
   const isEnabled = true;
   ```

2. ✅ **Simplified Delay Configuration**: Use a consistent delay approach for all mock operations.
   ```typescript
   await wireframeConfig.delay(); // Uses default delay
   await wireframeConfig.delay(500); // Uses custom delay
   ```

3. ✅ **Direct Imports Only**: Import mock services directly without conditional logic.
   ```typescript
   // INSTEAD OF
   const service = isWireframeMode ? mockService : realService;
   
   // USE
   import { mockService } from '@/lib/mock/services/mock-service';
   ```

### Data Structure

1. ✅ **Type Definitions First**: Define complete types before implementing mock data.
   ```typescript
   export interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
     // ...other properties
   }
   
   export const mockUsers: User[] = [
     // Implementation follows the type definition
   ];
   ```

2. ✅ **Realistic Mock Data**: Mock data should be realistic and comprehensive.
   - Include edge cases (empty values, long text)
   - Cover all possible statuses
   - Use realistic naming (no "Test User 1")
   - Include data relationships (foreign keys)

3. ✅ **Consistent ID Formats**: Use consistent, predictable ID formats.
   ```typescript
   // Equipment: 'equip-1', 'equip-2'
   // Users: 'user-1', 'user-2'
   // Events: 'evt-1', 'evt-2'
   ```

### API Implementation

1. ✅ **Standardized Response Format**: All API responses should follow the same format.
   ```typescript
   // Success format
   return NextResponse.json({ 
     data: result,
     total: result.length,
     page: page || 1,
     totalPages: totalPages || 1
   });
   
   // Error format
   return NextResponse.json(
     { error: errorMessage },
     { status: errorStatusCode }
   );
   ```

2. ✅ **Complete Error Handling**: Handle all error cases in mock implementations.
   ```typescript
   try {
     // Implementation
   } catch (error) {
     console.error('Error description:', error);
     return NextResponse.json(
       { error: error instanceof Error ? error.message : 'An unknown error occurred' },
       { status: 500 }
     );
   }
   ```

3. ✅ **Query Parameter Support**: Support filtering, sorting, and pagination via query parameters.
   ```typescript
   // Extract and process query parameters consistently
   const searchParams = request.nextUrl.searchParams;
   const pageStr = searchParams.get('page');
   const pageSizeStr = searchParams.get('pageSize');
   const sortBy = searchParams.get('sortBy');
   // ...process parameters
   ```

### UI Components

1. ✅ **Loading States**: All components must handle loading states correctly.
   ```tsx
   const [loading, setLoading] = useState(true);
   
   // Show loading indicator during data fetch
   if (loading) {
     return <LoadingSpinner />;
   }
   ```

2. ✅ **Error States**: Components must handle and display error states.
   ```tsx
   const [error, setError] = useState<string | null>(null);
   
   // Show error message if present
   if (error) {
     return <ErrorMessage message={error} />;
   }
   ```

3. ✅ **Empty States**: Components should handle empty data states gracefully.
   ```tsx
   if (data.length === 0) {
     return <EmptyState message="No items found" />;
   }
   ```

4. ✅ **Keep Styles Intact**: Do not modify component styling or layout.
   ```tsx
   // KEEP all className attributes and style objects intact
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

### Authentication

1. ✅ **Mock Auth Provider**: Use a mock auth provider with localStorage persistence.
   ```tsx
   const AuthContext = createContext<AuthContextType>(null);
   
   export function AuthProvider({ children }) {
     // Implementation with localStorage for session persistence
   }
   ```

2. ✅ **Simulate Auth Flow**: Simulate complete authentication flows, including:
   - Login/logout
   - Session expiration
   - Role-based access
   - OAuth flows (visually only)

3. ✅ **Role-Based UI**: Preserve role-specific UI differences.
   ```tsx
   // Implement role checks in components
   {user.role === 'admin' && <AdminControls />}
   {user.role === 'customer' && <CustomerDashboard />}
   ```

### Integration Simulation

1. ✅ **Maintain Adapter Pattern**: Keep the adapter pattern for all integrations.
   ```typescript
   // Mock adapter implementation
   export class MockGoogleWorkspaceAdapter implements GoogleWorkspaceAdapterInterface {
     // Implementation
   }
   ```

2. ✅ **Connection State**: Simulate connection state for integrations.
   ```typescript
   // Simulate connection state
   private connected = true;
   
   isConnected(): boolean {
     return this.connected;
   }
   ```

3. ✅ **Realistic Authentication Flows**: Simulate realistic authentication flows for integrations.
   ```typescript
   async connect(): Promise<boolean> {
     await wireframeConfig.delay(800); // Longer delay
     this.connected = true;
     return true;
   }
   ```

## Documentation Rules

1. ✅ **Code Comments**: Include descriptive comments for all mock implementations.
   ```typescript
   /**
    * Mock implementation of Google Workspace adapter
    * Simulates Google Drive, Calendar, and Tasks functionality
    * without actual API connections
    */
   ```

2. ✅ **Type Definitions**: Include complete type definitions with documentation.
   ```typescript
   /**
    * Represents a user in the system
    */
   export interface User {
     /**
      * Unique identifier for the user
      */
     id: string;
     
     /**
      * User's email address, used for authentication
      */
     email: string;
     
     // ...other properties with documentation
   }
   ```

3. ✅ **README Updates**: Update README files to reflect wireframe-only implementation.
   ```markdown
   # Mock Services
   
   This directory contains mock implementations of services for the wireframe version.
   These implementations simulate the behavior of real services without external dependencies.
   ```

## Testing Rules

1. ✅ **Manual Verification**: All wireframe functionality must be manually verified:
   - Test all user roles
   - Test all CRUD operations
   - Test filtering, sorting, pagination
   - Test error handling

2. ✅ **Cross-Browser Testing**: Test the wireframe in multiple browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge

3. ✅ **Responsive Testing**: Test across different screen sizes:
   - Desktop
   - Tablet
   - Mobile

## Deployment Rules

1. ✅ **Vercel Compatibility**: Ensure compatibility with Vercel deployment:
   - No server-side dependencies
   - Proper handling of environment variables
   - Static generation where possible

2. ✅ **Performance Optimization**: Optimize for performance:
   - Minimize bundle size
   - Optimize images
   - Efficient rendering

3. ✅ **Environment Cleanup**: Remove unused environment variables and configurations.

## Exclusion Rules

The following items should be completely removed or replaced:

1. ✅ **Supabase Client Initialization**: Remove all Supabase client initialization.
   ```typescript
   // REMOVE
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(...);
   ```

2. ✅ **Database Migrations**: Remove or comment out database migration files.

3. ✅ **External API Keys**: Remove all external API keys and credentials.

4. ✅ **Feature Flags**: Remove feature flags and conditional environment checks.
   ```typescript
   // REMOVE
   if (process.env.NEXT_PUBLIC_FEATURE_ENABLED === 'true') {
     // Feature implementation
   }
   ```

## Additions for Wireframe-Only Approach

1. ✅ **Wireframe Indicator**: Add a visual indicator showing the application is in wireframe/demo mode.
   ```tsx
   export default function WireframeIndicator() {
     return (
       <div className="fixed bottom-0 left-0 w-full bg-yellow-100 text-yellow-800 py-2 px-4 text-center text-sm z-50">
         Investor Demo Mode - Using Mock Data
       </div>
     );
   }
   ```

2. ✅ **Simplified Configuration**: Use a simplified configuration approach with hardcoded values.
   ```typescript
   export const wireframeConfig = {
     enabled: true,
     defaultDelay: 300,
     // Other configurations
   };
   ```

3. ✅ **Direct Mock Imports**: Use direct imports of mock services without conditional logic.
   ```typescript
   // INSTEAD OF
   const service = isWireframeMode ? mockService : realService;
   
   // USE
   import { mockService } from '@/lib/mock/services/mock-service';
   ```

4. ✅ **Always-Redirect Middleware**: Update middleware to always redirect to mock implementations.
   ```typescript
   if (isApiRequest) {
     // Always redirect to mock API
     return NextResponse.rewrite(new URL(`/api/mock${path}`, request.url));
   }
   ```

## Maintenance Guidelines

1. ✅ **Documentation Updates**: Update documentation when making changes to the wireframe implementation.

2. ✅ **Consistency Check**: Ensure all mock implementations follow the same patterns and conventions.

3. ✅ **Visual Verification**: Verify that visual appearance matches the original application after changes.

## Implementation Checklist

- [x] Create mock directory structure
- [x] Define mock data structures and types
- [x] Implement mock authentication
- [x] Create mock API routes
- [x] Update components to use mock services
- [x] Add wireframe indicator
- [x] Simplify configuration
- [x] Update middleware
- [x] Update documentation
- [ ] Test all functionality
- [ ] Optimize for performance
- [ ] Deploy to Vercel

## Conclusion

By following these rules, the wireframe implementation will maintain visual fidelity and user experience while removing backend dependencies. This approach creates a clean, maintainable codebase focused solely on the investor demonstration use case.
