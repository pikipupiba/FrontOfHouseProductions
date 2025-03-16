# Active Context

## Current Focus

The Front of House Productions (FOHP) web application project is in the initialization phase. Currently, we are:

1. Setting up the project documentation and memory bank
2. Establishing the architectural foundation
3. Planning the initial development roadmap

## Recent Changes

- Created the memory bank structure with core files:
  - projectbrief.md
  - productContext.md
  - systemPatterns.md
  - techContext.md
  - activeContext.md (this file)

## Next Steps

### Immediate Priorities

1. **Project Setup**:
   - Initialize Next.js project with TypeScript and Tailwind CSS
   - Set up Supabase project and initial database schema
   - Configure GitHub repository with appropriate branching strategy
   - Establish CI/CD pipeline with Vercel

2. **Core Infrastructure**:
   - Implement authentication flow with Supabase
   - Create base layout components
   - Set up responsive design framework
   - Establish routing structure with App Router

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

## Development Approach

The initial development will follow a phased approach:

1. **Foundation Phase**: Core infrastructure, authentication, basic layout
2. **Customer Portal Phase**: Equipment catalog, rental workflow, document management
3. **Employee Portal Phase**: Event information, task management, basic tools
4. **Advanced Features Phase**: Integrations, advanced tools, reporting

We are currently preparing to begin the Foundation Phase.
