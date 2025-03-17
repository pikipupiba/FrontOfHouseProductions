# Resolved Issues

**File Purpose**: Archive resolved issues that have been addressed in the project  
**Related Files**: [progress.md](../progress.md), [activeContext.md](../activeContext.md)  
**Main Reference**: This is an archive file - for current issues see [progress.md](../progress.md)  
**Navigation**: For complete memory bank navigation, see [index.md](../index.md)

This file archives historical issues that have been addressed and resolved in the project.

## Infrastructure & Configuration

1. **Vercel Environment Variable Truncation**: Fixed an "Invalid API key" error in the Vercel deployment (while local login worked fine) by correcting a truncated Supabase API key in the Vercel dashboard. The JWT tokens used as API keys are quite long and can get truncated when copying to environment variable fields.

2. **Module System Compatibility**: Next.js 15+ with files using .mjs extension must use ES Module syntax (export default) rather than CommonJS (module.exports). We encountered and resolved this issue with the PostCSS configuration.

3. **SQL Syntax Errors**: Encountered and resolved a SQL syntax error in the migration script where `ALTER SCHEMA public REPLICA IDENTITY FULL;` was incorrectly used. REPLICA IDENTITY is for tables, not schemas. Replaced with UUID extension creation for proper function availability.

## Authentication & Security

1. **Supabase Auth Helpers Deprecation**: The @supabase/auth-helpers-nextjs package is deprecated in favor of @supabase/ssr. We've switched to using the newer recommended package.

2. **Multi-Role Security**: We've designed a Row-Level Security system in the database schema to handle different user roles (customers, employees, managers), and have addressed infinite recursion in policy checks with security definer functions.

## Component Structure & Navigation

1. **Client vs Server Components**: Identified and fixed issues with 'use client' directives in components. Properly separating client and server component code is critical for Next.js App Router architecture.

2. **Metadata in Client Components**: Fixed conflicts between 'use client' directive and metadata exports in the Contact page by creating a separate layout.tsx file that handles metadata. This follows Next.js best practices for handling SEO metadata in client-side interactive pages.

3. **Navigation Links**: Fixed links in the navigation bar that pointed to incorrect routes (e.g., "/login" instead of "/auth/login"), ensuring proper user flow throughout the site.

4. **Redundant Dashboard Page**: The generic dashboard page redundancy was eliminated by replacing it with an auto-redirect to appropriate role-specific portals. The dashboard route now serves as a routing layer that directs users to their correct portal.

## Architecture & Integration

1. **Multi-Integration Architecture**: We've designed a comprehensive integration architecture with adapter pattern, caching strategy, and synchronization approach to handle multiple third-party integrations with different authentication methods (OAuth, API keys) and data formats. This provides a standardized approach for all external service integrations.
