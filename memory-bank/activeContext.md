# Active Context

## Current Focus

The Front of House Productions (FOHP) web application project has successfully completed the initial foundation phase, with all main site pages and the landing page fully implemented. We are now moving into the customer and employee portal development phases. Currently, we are:

1. Completing the user authentication experience with profile management
2. Preparing to develop the customer portal core features
3. Refining the UI/UX with consistent design elements across pages
4. Planning for employee portal implementation
5. Addressing technical improvements like ESLint issues

## Recent Changes

- Implemented core integration infrastructure:
  - Built comprehensive adapter pattern implementation for all third-party integrations
  - Created base adapter interface defining the standard contract for all service adapters
  - Implemented integration manager singleton for centralized adapter coordination
  - Built RetryStrategy with exponential backoff and jitter for resilient API calls
  - Implemented SyncJob framework for background synchronization
  - Created CredentialsManager for secure credential storage and retrieval
  - Developed Supabase database schema for integration cache tables with RLS policies
  - Added integration-specific error types and handling mechanisms
  - Created comprehensive documentation with usage examples
  - Executed migration script to create the necessary database tables for integration
- Updated memory bank documentation to reflect current progress
- Implemented user profile management system:
  - Created profile page with form to edit user information
  - Added profile viewing and editing functionality
  - Implemented automatic profile creation for new users
  - Ensured proper data validation and error handling
- Created role-based portal system:
  - Implemented portal switching mechanism for different user roles
  - Created separate portals for customers, employees, and managers
  - Implemented role-based access control for each portal
  - Added visual interfaces tailored to each user role's needs
- Reorganized memory bank to improve efficiency:
  - Moved historical context to archive files
  - Maintained key integration and dependency information in main files
  - Improved .clinerules with additional technical insights

> **Note**: Historical changes have been archived to `memory-bank/archive/previous-context.md`

## Next Steps

### Immediate Priorities

5. **Customer Portal Development**: 🔄 IN PROGRESS
   - Implement customer portal interface ✅ 
   - Implement rental management features with Current RMS integration 🔄
   - Create document submission system
   - Build contract signing mechanism
   - Develop customer data storage
   - Create event timeline tools

7. **Employee Portal Development**: 🔄 STARTED
   - Implement employee dashboard interface ✅
   - Build event information display
   - Create task management system
   - Develop employee toolbox features
   - Implement time tracking functionality

7. **Management Portal Development**: 🔄 STARTED
   - Implement management dashboard interface ✅
   - Build staff management features
   - Implement approval workflows
   - Create reporting and oversight tools

## Active Decisions & Considerations

### Architecture Decisions

- **Authentication Strategy**: Using Supabase Auth with JWT and role-based access control
- **Database Schema Design**: Focusing on core entities first (Users, Equipment, Events)
- **Component Structure**: Implementing a component library with a clear hierarchy
- **State Management**: Using React Context API with zustand for complex state and TanStack Query for server state
- **Tech Stack Expansion**: Adopting a comprehensive set of libraries to support upcoming features (see techContext.md)

### Integration Architecture

- **Adapter Pattern**: Using a consistent adapter pattern for all external service integrations
- **Caching Strategy**: Implementing Supabase tables as a cache layer for external data with background synchronization
- **API Security**: Routing all external API calls through our backend to protect credentials and implement rate limiting
- **Implementation Priority**: 
  1. Current RMS (rental management)
  2. Document management
  3. Google Workspace
  4. Financial systems
  5. Social media

### Open Questions

- Specific API credential management approach for production environment
- Webhook configuration for real-time updates from Current RMS
- Authentication and data flow approach for multiple third-party integrations:
  - Current RMS (customer data, inventory tracking) - In planning
  - QuickBooks/Xero (invoices)
  - Google Workspace suite (Tasks, Calendar, Voice, Drive, Gmail)
  - Document signing services (DocuSign/Adobe)
  - Various social media platforms
- Approach for implementing the RFID scanning feature
- Implementation strategy for push notifications across devices
- Priority order for implementing integrations based on business impact
- Strategy for managing multiple OAuth authentication flows
- Data synchronization approach for offline/online scenarios

### Technical Explorations

- Researching best practices for Supabase row-level security with multiple user types
- Investigating options for offline functionality for field employees
- Exploring file upload and management capabilities in Supabase Storage with react-dropzone
- Evaluating real-time capabilities for task management features
- Expanded tech stack with additional libraries for upcoming feature implementation:
  - File management: react-dropzone, react-pdf, react-image-lightbox
  - UI enhancements: radix-ui components, tailwind-merge, clsx
  - Visualization: recharts, react-calendar-timeline, react-big-calendar
  - Animation & interactivity: framer-motion, react-hot-toast
  - State management: zustand for complex state scenarios

## Development Approach

The development is following a phased approach:

1. **Foundation Phase**: Core infrastructure, authentication, basic layout ✅ COMPLETED

2. **Portal Framework Phase**: ✅ COMPLETED
   - User profile management and role-based access control
   - Portal switching mechanism between different user types
   - Basic interfaces for all portal types (customer, employee, manager)

3. **Customer Portal Phase**: 🔄 IN PROGRESS
   - Equipment catalog, rental workflow, document management
   - This is our current focus, building on the portal framework to implement specific customer features
   - Next tasks:
     - Implement integration infrastructure for third-party services
     - Create Current RMS adapter with caching in Supabase
     - Build rental listing/detail views with synchronized data
     - Implement file upload for documents using react-dropzone and Supabase Storage
     - Build event timeline visualization with react-calendar-timeline

4. **Employee Portal Phase**: 🔄 STARTED
   - Event information, task management, basic tools
   - Initial interface created, now implementing specific functionality
   - Will use real-time features from Supabase for task updates
   - Will implement equipment tracking with RFID interfaces

5. **Management Portal Phase**: 🔄 STARTED
   - Staff management, approval workflows, reporting
   - Initial interface created, now implementing specific functionality
   - Will use recharts for data visualization and reporting
   - Will implement approval workflows with notifications

6. **Integration Infrastructure Phase**: 🔄 IN PROGRESS
   - Creating core integration manager service
   - Implementing adapter pattern for all external services
   - Building cache synchronization system
   - Setting up secure credential management

7. **Advanced Features Phase**: 📅 PLANNED
   - Additional integrations, advanced tools, reporting
   - Final phase focusing on integration with external systems and advanced functionality
   - Will include Google Workspace integration
   - Will implement push notifications for real-time alerts

## Memory Bank Maintenance

The memory bank serves as my complete knowledge repository for this project. To keep it efficient and effective:

### Primary Reference Files
- **index.md**: Central navigation point for all memory bank files
- **Core Files**: Current and active information (projectbrief.md, productContext.md, systemPatterns.md, techContext.md, activeContext.md, progress.md)
- **Archive Files**: Historical context in memory-bank/archive/ directory
- **.clinerules**: Technical patterns and project intelligence

### When to Update Memory Bank
1. After implementing significant changes
2. When discovering new patterns or approaches
3. After resolving issues (document in core files, later move to archive)
4. When requested with "update memory bank"

### Archive Process
When information becomes historical:
1. Identify content for archiving (completed work, resolved issues)
2. Move to appropriate archive file
3. Update cross-references in core files
4. Update index.md if needed

> **Note**: For comprehensive navigation guidance, refer to `memory-bank/index.md`
