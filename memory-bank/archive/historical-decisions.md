# Historical Decisions

**File Purpose**: Document past decisions on architecture and features that shaped the project  
**Related Files**: [systemPatterns.md](../systemPatterns.md), [activeContext.md](../activeContext.md)  
**Navigation**: For complete memory bank navigation, see [index.md](../index.md)

## Compiler Configuration: Switch from Babel to SWC (March 17, 2025)

**Challenge**: The project had a conflict between the `.babelrc` configuration and the usage of `next/font/google` in the layout component.

**Decision**: Removed the `.babelrc` file to allow Next.js to use its default SWC compiler.

**Rationale**:
- The presence of a custom Babel configuration file (`.babelrc`) forced Next.js to use Babel instead of SWC.
- The application uses `next/font/google` which specifically requires the SWC compiler.
- Jest tests already had the necessary Babel configuration inline in the `jest.config.js` file.

**Outcomes**:
- Resolved error: "next/font requires SWC although Babel is being used due to a custom babel config being present"
- Improved build performance with faster SWC compiler
- Maintained test functionality through inline Jest configuration
- Added documentation in `frontend/docs/compiler-notes.md`

**Alternative Solutions Considered**:
1. Using a different font loading strategy compatible with Babel
2. Configuring the project to use SWC for the app but Babel for tests

## Authentication and Authorization System (February 2025)

**Challenge**: Needed a secure, role-based authentication system with different portals for different user types.

**Decision**: Implemented Supabase Auth with custom role management and separate UI portals.

**Rationale**:
- Supabase Auth provides a complete authentication solution with JWTs
- Custom role management allows fine-grained control over permissions
- Separate UIs for customer, employee, and manager roles improves user experience

**Outcomes**:
- Created profiles and user_roles tables with appropriate RLS policies
- Implemented role-based redirects in auth callback handler
- Built separate dashboard interfaces for each role type
- Added role change request system for users wanting to change roles

## Integration Framework Architecture (March 2025)

**Challenge**: Needed a consistent and maintainable way to integrate with multiple external services.

**Decision**: Built an adapter-based integration framework with standardized interfaces.

**Rationale**:
- Adapter pattern provides a consistent interface for all integrations
- Centralized management improves maintainability
- Caching strategy reduces API calls and improves performance
- Error handling standardization improves reliability

**Outcomes**:
- Created BaseAdapter abstract class for all service adapters
- Implemented IntegrationManager for centralized adapter coordination
- Built RetryStrategy with exponential backoff for resilient API calls
- Developed Supabase database schema for integration caching
