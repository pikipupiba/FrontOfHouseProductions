# Task Summary: Investor-Ready-Wireframe-Conversion

## Task Definition

Convert the current Front of House Productions (FOHP) web application into a simplified wireframe version focused on visual demonstration for investors. This involves removing real authentication, database connections, and complex integrations while maintaining the complete visual appearance, user experience, and Vercel deployability.

## Goals

1. **Maintain Visual Integrity**: Preserve the complete UI, design, and user experience
2. **Remove Backend Dependencies**: Eliminate reliance on Supabase and other external services
3. **Create Mock Data Layer**: Implement static data to replace real database content
4. **Simplify Authentication**: Replace Supabase Auth with a simple mock authentication system
5. **Preserve Role-Based Experience**: Maintain customer, employee, and manager portal experiences
6. **Ensure Vercel Deployability**: Optimize for simplified deployment to Vercel
7. **Reduce Complexity**: Remove complex integrations while maintaining their visual representation

## Success Criteria

- Application loads and functions without Supabase or other external service connections
- Users can "log in" with different role types (customer, employee, manager)
- All pages render with realistic mock data
- Navigation between pages works as in the original application
- Portal switching between different roles functions visually
- Visual representation of integrations appears realistic
- Application correctly deploys to Vercel

## Current State Assessment

The current FOHP application is a sophisticated web platform with:

- **Authentication**: Supabase Auth with JWT and role-based access control using OAuth (multiple providers)
- **Database**: PostgreSQL database via Supabase with complex schema
- **Storage**: Supabase Storage and Google Drive API for file management
- **Integrations**: 
  - Google Workspace (Drive, Calendar, Tasks, Voice)
  - Current RMS (planned)
  - QuickBooks/Xero (planned)
  - DocuSign/Adobe (planned)
  - Social Media Platforms (planned)
  - Google Maps/Earth (planned)
  - RFID Inventory System (planned)
  - Emergency Notification System (planned)
  - Various Payment Platforms (planned)
- **Portal System**: Role-based portals for customers, employees, and managers
- **UI/UX**: Next.js frontend with Tailwind CSS styling
- **Push Notifications**: Firebase Cloud Messaging, Twilio (planned)

## Target State Architecture

The wireframe version will feature:

- **Authentication**: Direct mock authentication system using localStorage/cookies (no real auth)
- **Database**: Static TypeScript files for all data needs (no Supabase dependency)
- **Storage**: Static asset references instead of dynamic storage
- **Integrations**: Visual-only representation with static mock data
- **Portal System**: Preserved with mock data only
- **UI/UX**: Unchanged visually, but using mock data exclusively

## Conversion Process

### Phase 1: Setup Mock Environment
- Create mock data structures to completely replace database content
- Implement standalone authentication system
- Establish wireframe-only architecture (no dual-mode support)

### Phase 2: Authentication Replacement
- Remove Supabase authentication entirely
- Implement localStorage-based auth system
- Maintain login/signup UI with simplified backend
- Implement client-side role-based access

### Phase 3: Database Replacement
- Remove all Supabase dependencies and code
- Replace all database calls with mock TypeScript data
- Update API routes to only serve mock data
- Eliminate database migration files

### Phase 4: Integration Simplification
- Remove real Google Workspace integration code
- Implement visual-only mock components
- Create believable static representations of integration features

### Phase 5: Deployment Optimization
- Optimize for Vercel deployment
- Remove all real service dependencies
- Simplify build and deployment process

## Major Challenges

1. **Authentication Flow**: Ensuring the mock authentication system provides a realistic user experience
2. **Data Relationships**: Maintaining realistic relationships between mock data entities
3. **Dynamic Components**: Converting real-time components to static representations
4. **Visual Fidelity**: Ensuring the visual experience remains identical
5. **Role-Based Access**: Preserving the role-based UI differences without a real database

## Approach Details

1. **Direct Mock Authentication Implementation**:
   - Create an auth context using React Context API and localStorage exclusively
   - Define hardcoded user profiles for different roles
   - Implement sign-in/sign-up flows that visually match the original but without real auth
   - Remove all Supabase Auth code and dependencies

2. **Direct Mock Data Strategy**:
   - Create TypeScript files with static data for all entity types
   - Build in-memory data manipulation layer with CRUD operations
   - Ensure realistic relationships between mock data entities
   - Remove all database connection code

3. **Complete API Replacement**:
   - Replace all API routes with mock-only implementations
   - Remove Supabase client initialization and imports
   - Implement client-side filtering, pagination, and sorting
   - Simulate realistic API behavior with delays and error handling

4. **Visual-Only Integration Implementation**:
   - Create standalone mock versions of Google Drive, Calendar, and Tasks components
   - Remove all real API service code and dependencies
   - Maintain visual consistency with original integration components
   - Simulate connection states and authentication flows

5. **UI/UX Direct Implementation**:
   - Keep all UI components visually intact
   - Update component logic to work exclusively with mock data
   - Remove conditional imports and environment checks
   - Maintain responsive design across device sizes

## Timeline

1. **Phase 1**: 1-2 days - Setup mock environment
2. **Phase 2**: 1-2 days - Complete authentication replacement
3. **Phase 3**: 2-3 days - Complete database replacement
4. **Phase 4**: 1-2 days - Integration visual implementation
5. **Phase 5**: 1-2 days - Deployment optimization and testing
6. **Phase 6**: 1 day - Cleanup of all real service code

**Total Estimated Time**: 7-12 days

## Resources Required

- Existing FOHP codebase
- Sample mock data representative of real application data
- Next.js and React knowledge for context implementation
- Vercel for deployment testing
