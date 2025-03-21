# Mock Implementation Guide

This directory contains the mock implementation framework for the investor-ready wireframe mode. Below are guidelines for continuing and completing the implementation.

## Directory Structure

```
frontend/lib/mock/
├── config.ts           # Configuration settings for wireframe mode
├── context/            # React contexts for mock services
├── data/               # Static mock data files
│   ├── users.ts        # User and profile data
│   ├── equipment.ts    # Equipment data
│   ├── events.ts       # Event data
│   └── integrations/   # Integration-specific data
│       └── google-drive.ts
├── integrations/       # Mock integration services
│   ├── adapters/       # Service-specific adapters
│   │   └── mock-google-workspace-adapter.ts
│   └── mock-integration-manager.ts
└── services/           # Mock service implementations
    ├── mock-auth-service.ts
    └── mock-data-service.ts
```

## Implementation Pattern

Follow these steps to implement the remaining wireframe components:

### 1. Add Mock API Routes

Create additional API routes following the pattern established in `frontend/app/api/mock/equipment/route.ts`:

```
frontend/app/api/mock/
├── equipment/          # COMPLETED
│   └── route.ts
├── events/             # TO DO
│   └── route.ts 
├── users/              # TO DO
│   └── route.ts
├── rentals/            # TO DO
│   └── route.ts
└── ...
```

Each API route should:

- Import the appropriate mock data service
- Implement GET, POST, PUT, DELETE methods as needed
- Handle query parameters for filtering, sorting, pagination
- Include proper error handling
- Use the `wireframeConfig.maybeFailRandomly()` for realistic behavior

### 2. Update UI Components

Update UI components to work with mock services:

1. Import the mock context providers
2. Ensure components fetch data from mock API routes
3. Add appropriate loading states and error handling
4. Verify that forms submit to mock API endpoints

#### Example Component Update Pattern:

```tsx
// Before (using Supabase directly)
const { data, error } = await supabase
  .from('equipment')
  .select('*')
  .order('name');

// After (using fetch to work with both real and mock APIs)
const response = await fetch('/api/equipment?sortBy=name&sortDirection=asc');
const { data, error } = await response.json();
```

### 3. Implement Auth Flow Components

Update authentication components:

1. Use the `AuthProvider` from `frontend/lib/context/auth-context.tsx`
2. Update login/signup pages to use mock authentication
3. Add appropriate redirects and error handling

### 4. Test Role-Based Access

Test the application with different user roles:

1. Customer access
2. Employee access
3. Manager access

Ensure that:
- Each role sees the appropriate UI elements
- Permissions are enforced correctly
- Navigation works as expected

### 5. Integration UI Components

Update integration UI components to work with mock adapters:

1. Use the `mockIntegrationManager` to access mock adapters
2. Display mock data from Google Workspace adapter
3. Implement placeholder UIs for unimplemented integrations

### 6. Add Wireframe Mode Indicator

Add a visual indicator when running in wireframe mode:

```tsx
import wireframeConfig from '@/lib/mock/config';

{wireframeConfig.enabled && (
  <div className="bg-yellow-100 p-2 text-sm text-center fixed bottom-0 w-full">
    Running in Wireframe Mode - Using Mock Data
  </div>
)}
```

## Testing

Test the wireframe implementation:

1. Run `npm run dev:wireframe` to start in wireframe mode
2. Test all pages and functionality
3. Verify that forms submit correctly
4. Check that data persists in memory during the session
5. Test login and role-based access

## Building for Deployment

Build for deployment:

1. Run `npm run build:wireframe` to build with wireframe mode enabled
2. Test the build with `npm run start:wireframe`
3. Verify that all features work correctly in production mode

## Documentation

See `frontend/docs/wireframe-mode.md` for complete documentation on using and extending wireframe mode.

## Completion Checklist

- [ ] All mock API routes implemented
- [ ] UI components updated to use mock services
- [ ] Authentication flow working with mock auth
- [ ] Role-based access working correctly
- [ ] Integrations showing appropriate mock data
- [ ] Wireframe mode visual indicator added
- [ ] Build and deployment tested
- [ ] Documentation updated

## Help and Support

If you encounter issues implementing the wireframe mode:

1. Check the patterns established in the existing mock implementations
2. Refer to `frontend/docs/wireframe-mode.md` for detailed documentation
3. Contact the development team for assistance
