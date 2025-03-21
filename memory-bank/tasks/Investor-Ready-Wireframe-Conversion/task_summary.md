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

- **Authentication**: Mock authentication system using localStorage/cookies
- **Database**: Static JSON files for all data needs
- **Storage**: Static asset references instead of dynamic storage
- **Integrations**: Visual representation with static mock data
- **Portal System**: Preserved but operating on mock data
- **UI/UX**: Unchanged, operating on mock data

## Conversion Process

### Phase 1: Setup Mock Environment
- Create mock data structures to replace database content
- Implement simple authentication system
- Set up environment for static data

### Phase 2: Authentication Replacement
- Replace Supabase authentication with mock system
- Maintain login/signup UI with simplified backend
- Implement role-based access with mock data

### Phase 3: Database Replacement
- Replace all Supabase database calls with static JSON
- Update API routes to serve mock data
- Remove database migration files

### Phase 4: Integration Simplification
- Replace Google Workspace integration with static mock UI
- Create believable static representations of integration features
- Maintain visual integration components

### Phase 5: Deployment Optimization
- Optimize for Vercel deployment
- Remove unnecessary dependencies
- Ensure environment variables work without real services

## Major Challenges

1. **Authentication Flow**: Ensuring the mock authentication system provides a realistic user experience
2. **Data Relationships**: Maintaining realistic relationships between mock data entities
3. **Dynamic Components**: Converting real-time components to static representations
4. **Visual Fidelity**: Ensuring the visual experience remains identical
5. **Role-Based Access**: Preserving the role-based UI differences without a real database

## Approach Details

1. **Mock Authentication Implementation**:
   - Create a simple auth context using React Context API and localStorage
   - Define hardcoded user profiles for different roles
   - Implement sign-in/sign-up flows that visually match the original

2. **Mock Data Strategy**:
   - Create JSON files for all entity types (users, equipment, rentals, etc.)
   - Implement helper functions to simulate CRUD operations
   - Ensure realistic relationships between mock data entities

3. **API Simplification**:
   - Modify all API routes to return static mock data
   - Remove Supabase client initialization
   - Simplify error handling for the wireframe version

4. **Integration Replacement**:
   - Create static versions of Google Drive, Calendar, and Tasks components
   - Replace real API calls with mock data functions
   - Maintain visual consistency with the original integration components

5. **UI/UX Preservation**:
   - Keep all UI components intact
   - Ensure all interactive elements provide visual feedback
   - Maintain responsive design across device sizes

## Timeline

1. **Phase 1**: 1-2 days - Setup mock environment
2. **Phase 2**: 1-2 days - Authentication replacement
3. **Phase 3**: 2-3 days - Database replacement
4. **Phase 4**: 1-2 days - Integration simplification
5. **Phase 5**: 1 day - Deployment optimization and testing

**Total Estimated Time**: 6-10 days

## Resources Required

- Existing FOHP codebase
- Sample mock data representative of real application data
- Next.js and React knowledge for context implementation
- Vercel for deployment testing
