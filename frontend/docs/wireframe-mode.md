# Wireframe Implementation Documentation

This document explains how to run, develop, and deploy the Front of House Productions application in its "Wireframe Implementation" - a simplified version designed for investor demonstrations without backend dependencies.

## Overview

The Wireframe Implementation provides a fully functional visual representation of the FOHP application without requiring any real backend services:

- No Supabase authentication or database
- No Google API connections
- No other external service connections

Instead, it uses:

- Static mock data in TypeScript files
- Local storage-based authentication
- In-memory CRUD operations
- Visual-only simulated integrations

This allows for easy deployment, demonstration, and sharing without the need to set up any backend services.

## Running the Application

### Local Development

To run the application during development:

```bash
# From the frontend directory
npm run dev
```

This will start the development server with the wireframe implementation.

### Building for Production

To build the application:

```bash
# From the frontend directory
npm run build
```

### Starting Production Server

To start the production server:

```bash
# From the frontend directory
npm run start
```

## Implementation Details

The wireframe implementation uses a simplified architecture:

- All API requests are automatically redirected to mock implementations
- Authentication is handled entirely through localStorage
- No environment variables are needed for configuration
- All services use mock implementations directly

## Demo Accounts

The following mock accounts are available for demonstration purposes:

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@example.com | password123 |
| Employee | employee@example.com | password123 |
| Manager | manager@example.com | password123 |

All accounts use the same password for simplicity during demonstrations.

## Features in Wireframe Implementation

### Authentication

- Email/password login with mock accounts
- Google OAuth simulation (no actual Google authentication)
- Role-based access control
- Session persistence in localStorage

### Data Management

- Static mock data for entities (equipment, events, rentals, etc.)
- In-memory CRUD operations
- Simulated API responses with realistic delays
- Pagination, filtering, and sorting

### Integrations

- Google Workspace integration (visual only)
  - Google Drive files and folders browsing (mock data)
  - Google Calendar (visual UI with mock data)
  - Google Tasks (visual UI with mock data)
- Other integrations show visual UI with mock data

## Architecture

The wireframe implementation follows these patterns:

1. **API Redirection**: When wireframe mode is active, the middleware redirects API requests to mock implementations.

2. **Mock Services**: Each service has a mock implementation that mimics the behavior of the real service.

3. **Mock Data**: Static data files provide realistic content for display.

4. **Mock Auth Context**: Authentication is handled through a React context with localStorage persistence.

5. **Simulated Delays**: Network delays are simulated to provide a realistic feel.

## Extending the Wireframe Implementation

### Adding New Mock Data

To add new mock data:

1. Create a new file in `frontend/lib/mock/data/` with your static data.
2. Follow the pattern of existing files, exporting both interfaces and mock data.
3. Add helper functions for common operations (filtering, searching, etc.).

### Adding New Mock API Routes

To add a new mock API route:

1. Create a new file in `frontend/app/api/mock/{your-route}/route.ts`.
2. Use the MockDataService to handle CRUD operations.
3. Implement the appropriate HTTP methods (GET, POST, PUT, DELETE).
4. Add proper error handling and response formatting.

### Adding a Wireframe Indicator

To add a visual indicator that shows the app is running in wireframe mode:

```tsx
import wireframeConfig from '@/lib/mock/config';

// In a layout component
{
  <div className="bg-yellow-100 p-2 text-sm text-center fixed bottom-0 w-full">
    Investor Demo Mode - Using Mock Data
  </div>
}
```

## Technical Limitations

- No real-time capabilities (subscriptions, WebSockets)
- No actual file uploads (simulated only)
- No actual email sending or notifications
- OAuth flows are simulated (no actual provider authentication)

## Troubleshooting

### Authentication Issues

If you experience authentication issues:

1. Clear localStorage in your browser (localStorage.clear() in console)
2. Restart the development server
3. Try using a different mock account

### API Route Issues

If mock API routes aren't working:

1. Check the middleware-mock.ts file - ensure your route is included in the API_PATHS array
2. Check that the appropriate mock API implementation exists in /api/mock/
3. Check browser console for specific error messages

### Performance Issues

If the application seems slow:

1. Check the delay settings in wireframeConfig
2. Reduce the amount of mock data if performance is an issue
3. Ensure that mock data services aren't processing too much data at once

## Support

For any questions or issues with the wireframe implementation, please contact the development team.

## Code References

The key files for the wireframe implementation are:

- `frontend/lib/mock/config.ts` - Core configuration
- `frontend/middleware-mock.ts` - API route redirection
- `frontend/lib/mock/services/mock-data-service.ts` - CRUD operations
- `frontend/lib/mock/services/mock-auth-service.ts` - Authentication
- `frontend/lib/context/auth-context.tsx` - Auth context provider
- `frontend/lib/mock/integrations/` - Integration mocks
