# Active Context

## Current Focus

The Front of House Productions (FOHP) web application project is in the initialization phase. Currently, we are:

1. Setting up the project documentation and memory bank
2. Establishing the architectural foundation
3. Planning the initial development roadmap
4. Setting up the development environment
5. Configuring hosting and deployment infrastructure

## Recent Changes

- Created the memory bank structure with core files:
  - projectbrief.md
  - productContext.md
  - systemPatterns.md
  - techContext.md
  - activeContext.md (this file)
  - hosting-deployment.md
- Fixed PostCSS configuration in the Next.js project to use ES Module syntax instead of CommonJS syntax
- Successfully ran the development server with npm run dev
- Set up Vercel deployment for the frontend application
- Created vercel.json configuration file with settings for Supabase integration
- Created Supabase setup documentation
- Implemented Supabase client and server integration:
  - Installed Supabase client libraries (@supabase/supabase-js, @supabase/ssr)
  - Created client and server Supabase utilities
  - Set up authentication pages (sign up, login, callback)
  - Added middleware for session management
  - Created initial database schema with Row Level Security
- Executed database migration in Supabase:
  - Fixed SQL syntax error in migration script (replaced REPLICA IDENTITY with UUID extension)
  - Successfully created all database tables, RLS policies, and triggers
  - Verified the complete schema implementation in Supabase dashboard

## Next Steps

### Immediate Priorities

1. **Project Setup**:
   - Initialize Next.js project with TypeScript and Tailwind CSS ✅
   - Set up Supabase project and initial database schema ✅✅
   - Complete Supabase connection with environment variables
   - Configure GitHub repository with appropriate branching strategy
   - Establish CI/CD pipeline with Vercel ✅

2. **Core Infrastructure**:
   - Implement authentication flow with Supabase ✅
   - Create base layout components
   - Set up responsive design framework
   - Establish routing structure with App Router ✅

3. **Initial Feature Development**:
   - Create landing page with key sections
   - Implement user registration and login
   - Set up basic profile management
   - Build portal switching mechanism (Customer/Employee/Admin)

## Active Decisions & Considerations

### Architecture Decisions

- **Authentication Strategy**: Using Supabase Auth with JWT and role-based access control
- **Database Schema Design**: Focusing on core entities first (Users, Equipment, Events)
- **Component Structure**: Implementing a component library with a clear hierarchy
- **State Management**: Using React Context for global state and React Query for server state

### Open Questions

- Integration specifics with existing inventory management system
- Approach for implementing the RFID scanning feature
- Complexity of the Google Workspace integration
- Implementation strategy for push notifications across devices

### Technical Explorations

- Researching best practices for Supabase row-level security with multiple user types
- Investigating options for offline functionality for field employees
- Exploring file upload and management capabilities in Supabase Storage
- Evaluating real-time capabilities for task management features
- Ensuring proper module system compatibility in Next.js 15+ configuration files (.mjs files must use ES Module syntax)
- Configured Vercel deployment for Next.js applications
- Documented Supabase integration approach for backend services
- Implemented multi-role security with Row Level Security policies in the database schema
- Adopted newer Supabase SSR package instead of deprecated auth-helpers

## Development Approach

The initial development will follow a phased approach:

1. **Foundation Phase**: Core infrastructure, authentication, basic layout
2. **Customer Portal Phase**: Equipment catalog, rental workflow, document management
3. **Employee Portal Phase**: Event information, task management, basic tools
4. **Advanced Features Phase**: Integrations, advanced tools, reporting

We are currently preparing to begin the Foundation Phase.
