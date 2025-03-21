# Relevant Patterns: Investor-Ready-Wireframe-Conversion

This document outlines the key design patterns and software architecture patterns used in the wireframe implementation.

## Core Design Patterns

### 1. Repository Pattern for Mock Data

The wireframe uses the Repository pattern to abstract data access logic and provide a consistent interface for retrieving mock data.

**Implementation Details**:
- Generic `MockDataService<T>` class that provides CRUD operations
- Type-safe data access and manipulation
- Consistent interface across all entity types

```typescript
// Example Repository Pattern Implementation
export class MockDataService<T extends Entity> {
  private data: T[];

  constructor(initialData: T[], entityName: string, delayMs = 300) {
    this.data = [...initialData];
    // ...
  }

  async getAll(options): Promise<{ data: T[]; total: number }> {
    // Logic for filtering, sorting, pagination...
    return { data: filteredData, total: filteredData.length };
  }

  async getById(id: string): Promise<T> {
    // Find by ID implementation...
    return item;
  }

  // Other CRUD operations...
}
```

### 2. Facade Pattern for API Routes

API routes act as facades that shield clients from the complexity of data retrieval and processing.

**Implementation Details**:
- Consistent URL structure for all entity types
- Standardized error handling and response formats
- Query parameter processing for filtering and pagination

```typescript
// Example Facade in API Route
export async function GET(request: NextRequest) {
  try {
    // Process request parameters
    // Apply filtering, sorting, pagination
    // Return standardized response
    return NextResponse.json(result);
  } catch (error) {
    // Standardized error handling
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
```

### 3. Context Provider Pattern for Authentication

React Context API is used to provide application-wide access to authentication state.

**Implementation Details**:
- `AuthContext` with authentication methods and user state
- `localStorage` for session persistence
- Role-based access control via the context

```typescript
// Example Context Pattern
export const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Auth methods implementation...
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      // ...other methods
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming the context
export const useAuth = () => useContext(AuthContext);
```

### 4. Strategy Pattern for Mock Implementations

Different strategies for data handling without changing the client interface.

**Implementation Details**:
- Mock service implementations follow the same interface as real services
- Client code doesn't need to change when switching implementations
- Different mock strategies can be swapped in for testing or demonstration purposes

## Architectural Patterns

### 1. Clean Architecture

The wireframe maintains a clean architecture approach with distinct layers and dependency rules.

**Layers**:
- **Presentation Layer**: UI components, pages
- **Application Layer**: API routes, business logic
- **Domain Layer**: Core entities and business rules
- **Infrastructure Layer**: Mock data, services

**Dependency Rule**: Inner layers don't depend on outer layers. This enables:
- UI components that remain the same regardless of data source
- Business logic that doesn't know if it's working with mock or real data
- Entity definitions that remain consistent throughout the application

### 2. Mock Service Layer Architecture

A dedicated layer for mock services that replicate the behavior of real external services.

**Implementation Details**:
- Mock services in `frontend/lib/mock/services/*`
- Each service focuses on a specific domain (auth, data, storage)
- Simulated network delays and error handling

### 3. Feature-Oriented API Structure

API routes are organized based on features and entity types, making the codebase intuitive to navigate.

**Structure**:
```
frontend/app/api/mock/
├── equipment/route.ts
├── events/route.ts
├── users/route.ts
└── ...other entity types
```

## Frontend Patterns

### 1. Atomic Design for Components

Components are designed following atomic design principles:
- **Atoms**: Basic UI elements (buttons, inputs)
- **Molecules**: Combinations of atoms (form fields, cards)
- **Organisms**: Complex UI sections (forms, lists)
- **Templates**: Page layouts
- **Pages**: Complete screens with data

### 2. Compound Components for Complex UI

Complex UI elements are built using the compound component pattern, where multiple components work together through context.

### 3. Container/Presentation Pattern

Separation of data fetching and presentation logic:
- **Containers**: Connect to services, manage state and data flow
- **Presentation Components**: Focus purely on rendering UI based on props

## Communication Patterns

### 1. HTTP Request/Response

The primary communication pattern uses the fetch API for client-server communication, maintained even in the wireframe:

```typescript
// Example HTTP request pattern in a hook
export function useData(entityType: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/mock/${entityType}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error(`Error fetching ${entityType}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [entityType]);
  
  return { data, loading };
}
```

### 2. Event-Based Communication

For some UI interactions, event-based patterns are used to decouple components:
- Custom events for specific UI actions
- Hooks for subscribing to app-wide events

## Wireframe-Specific Patterns

### 1. Direct Import Pattern

In the wireframe-only implementation, we've moved from conditional imports to direct imports:

**Before (Conditional):**
```typescript
const AuthService = isWireframeMode 
  ? import('@/lib/mock/services/mock-auth-service')
  : import('@/lib/services/auth-service');
```

**After (Direct):**
```typescript
import { mockAuthService } from '@/lib/mock/services/mock-auth-service';
```

This simplifies the codebase and makes it more maintainable for the wireframe version.

### 2. Always-Enabled Configuration

Configuration values are hardcoded rather than dynamically determined:

**Before (Dynamic):**
```typescript
export const WIREFRAME_MODE = 
  process.env.NEXT_PUBLIC_WIREFRAME_MODE === 'true' || false;
```

**After (Hardcoded):**
```typescript
export const wireframeConfig = {
  enabled: true,
  // Other configurations...
};
```

This removes complexity and makes the wireframe implementation more predictable.

### 3. Middleware Always-Redirect Pattern

The middleware now always redirects to mock implementations without conditional logic:

**Before (Conditional):**
```typescript
if (WIREFRAME_MODE && isApiRequest) {
  // Redirect to mock API
}
```

**After (Always Redirect):**
```typescript
if (isApiRequest) {
  // Always redirect to mock API
}
```

## Benefits of These Patterns

1. **Separation of Concerns**: Each component has a single responsibility
2. **Testability**: Mock services can be easily tested in isolation
3. **Maintainability**: Clean structure makes the codebase easier to navigate
4. **Scalability**: Easy to add new features or entity types
5. **Consistency**: Standardized patterns across the application
6. **Simplicity**: Direct implementation makes the codebase simpler to understand

These patterns together create a robust architecture for the wireframe implementation that maintains visual fidelity and user experience while removing backend dependencies.
