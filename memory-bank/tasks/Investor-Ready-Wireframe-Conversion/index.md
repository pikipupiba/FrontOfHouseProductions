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

## Key Files from Main Project

Key files that will need modification:

- **Auth-related**:
  - `frontend/lib/services/auth-service.ts`
  - `frontend/lib/services/server-auth-service.ts`
  - `frontend/app/auth/callback/route.ts`
  - `frontend/lib/types/auth.ts`

- **Database-related**:
  - `frontend/lib/supabase/client.ts`
  - `frontend/lib/supabase/server.ts`
  - All migration files in `frontend/supabase/migrations/`

- **Integration-related**:
  - `frontend/lib/integrations/` directory
  - Integration-specific API routes

## Related Memory Bank Files

- [projectbrief.md](../../projectbrief.md) - Original project requirements
- [systemPatterns.md](../../systemPatterns.md) - System architecture that will be simplified
- [techContext.md](../../techContext.md) - Technical stack details
- [activeContext.md](../../activeContext.md) - Current project context
