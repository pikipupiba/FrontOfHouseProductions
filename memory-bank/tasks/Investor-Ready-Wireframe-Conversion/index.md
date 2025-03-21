# Investor-Ready-Wireframe-Conversion

**Task Purpose**: Convert the current Front of House Productions application into a simplified wireframe version for investor demonstrations, removing real authentication, database connections, and complex integrations while maintaining visual appeal and Vercel deployability.

## Navigation

This memory bank contains all information related to the Investor-Ready-Wireframe-Conversion task:

1. [Task Summary](task_summary.md) - Overview of the conversion process and goals
2. [Relevant Patterns](relevant_patterns.md) - Design patterns for mock implementations
3. [Integration Details](integration_details.md) - Plan for replacing real integrations with mock data
4. [Wireframe Architecture](wireframe_architecture.md) - Architecture changes for the wireframe version
5. [Progress Tracker](progress_tracker.md) - Track conversion progress
6. [Decision Log](decision_log.md) - Document key decisions during implementation
7. [Task Rules](task_rules.md) - Guidelines for maintaining visual fidelity

## Current Status

Implementation Phase - Transitioning to Wireframe-Only Approach

## Recent Updates

- Pivoted from dual-mode approach to wireframe-only implementation
- Removed environment variable checks for simpler, cleaner codebase
- Hardcoded wireframe mode as the only operating mode
- Updated mock API routes for users and events
- Added wireframe indicator component to clearly show demo mode
- Simplified middleware to always redirect to mock API routes

## Task Overview

The Front of House Productions (FOHP) web application is currently a fully-functional system with authentication, database connections, and third-party integrations. For investor presentations, we need a simplified version that:

- Maintains the complete visual appearance and user experience
- Operates without real authentication or database connections
- Uses mock data instead of real integrations
- Remains deployable to Vercel
- Demonstrates the core functionality without backend complexity
- Showcases the comprehensive feature set described in the updated project brief
- Simulates planned features that would impress investors

### Enhanced Feature Showcase

The wireframe will simulate interfaces for both current and planned features including:

#### Customer Portal
- Sales pipeline and event management
- Venue specifications and timelines
- Data storage for stage plots and media
- Interactive event planning tools (budgeting, equipment recommendations)
- Customizable stage and lighting designer
- Google Earth venue mapping
- Weather and environmental risk alerts
- Multi-user collaboration and social media integration

#### Employee Portal
- RFID-enabled inventory tracking
- Google Workspace integration
- Job assignments and equipment checklists
- SOS emergency system
- Production power calculator
- Training library and incident reporting
- Automated reimbursement system

#### Management Tools
- AI-generated employee scheduling
- Real-time profit and expense dashboard
- Event risk analysis and monitoring
- Inventory management
- Emergency action plan generator
- Approval system for purchases

## Key Files Implemented/Modified

- **Configuration**:
  - `frontend/lib/mock/config.ts` - Simplified to always use wireframe mode
  - `frontend/middleware-mock.ts` - Updated to always redirect to mock APIs
  - `frontend/next.config.ts` - Simplified for wireframe-only approach
  - `frontend/package.json` - Removed dual-mode scripts

- **Mock API Routes**:
  - `frontend/app/api/mock/users/route.ts` - User data API
  - `frontend/app/api/mock/events/route.ts` - Event data API
  - `frontend/app/api/mock/equipment/route.ts` - Equipment data API

- **Components**:
  - `frontend/app/components/ui/WireframeIndicator.tsx` - Added indicator component
  - `frontend/app/layout.tsx` - Updated to include wireframe indicator

## Next Steps

- Continue implementing remaining mock API routes
- Update UI components to use mock data services directly
- Remove unnecessary real service imports
- Update documentation for wireframe-only approach
