# Task Rules: Investor-Ready-Wireframe-Conversion

This document outlines the guidelines and principles to follow when converting the FOHP application to a wireframe version for investor presentations.

## Visual Fidelity Rules

### 1. Maintain Exact Visual Appearance

- **All UI components must look identical** to the production version
- **Do not simplify visual elements** even if backend is simplified
- **Preserve all transitions and animations** for a smooth experience
- **Keep all responsive design elements** working across device sizes
- **Maintain exact color schemes, fonts, and styling** from the original

### 2. Interaction Behavior

- **All clickable elements must provide visual feedback** when clicked
- **Navigation between pages must work identically** to production
- **Error states and loading indicators** must be preserved
- **Form validations** should work on the client side
- **Modal dialogs** and other interactive elements must behave normally

### 3. Data Representation

- **Use realistic mock data** that resembles actual production data
- **Maintain consistent entity relationships** in mock data
- **Display appropriate loading states** before showing mock data
- **Ensure pagination controls work** even if using static data
- **Implement sorting and filtering** to work with mock data

## Simplification Boundaries

### 1. What Can Be Simplified

- **Backend connections** (replace with mock data)
- **Authentication mechanisms** (replace with mock auth)
- **Database operations** (replace with static/local data)
- **External API calls** (replace with static responses)
- **Server-side processing** (simulate with client-side logic when possible)
- **Environment variables** for external services
- **Build and deployment complexity**

### 2. What Cannot Be Simplified

- **UI components and visual design**
- **User flows and navigation**
- **Role-based interface differences**
- **Error handling and display**
- **Form validation and user feedback**
- **Responsive design behavior**
- **Performance optimization** (should still feel snappy)

## Mock Data Guidelines

### 1. Data Quality

- **Create detailed mock entities** with all fields used in the UI
- **Use realistic values and formats** that mirror production data
- **Include edge cases** like long text, special characters, etc.
- **Maintain referential integrity** between related entities
- **Create diverse example data** showing various scenarios

### 2. Data Quantity

- Provide **enough mock data to demonstrate pagination** where relevant
- Include **5-10 quality examples for each entity type**
- Ensure **at least 3 examples of each category or subtype**
- Have **sufficient data for meaningful filtering/sorting demos**
- Create **comprehensive data sets for featured sections** likely to be shown

### 3. Data Consistency

- **All mock data should tell a coherent story**
- **Dates should make chronological sense**
- **User data should be consistent across views**
- **Related entities should maintain logical relationships**
- **Status indicators should reflect a realistic system state**

## Implementation Rules

### 1. Code Structure

- **Maintain the same component hierarchy** as the production version
- **Keep file naming consistent** with the existing patterns
- **Separate mock implementations** into their own directories/files
- **Use consistent patterns** for all mock implementations
- **Comment mock implementations clearly** for future reference

### 2. TypeScript Requirements

- **Maintain all existing TypeScript interfaces**
- **Mock data must conform to existing types**
- **Do not use `any` type** in mock implementations
- **Include proper JSDoc comments** for mock functions
- **Maintain strict type checking** throughout the codebase

### 3. Error Handling

- **Simulate realistic error scenarios**
- **Implement proper error boundaries**
- **Handle edge cases gracefully**
- **Maintain error messaging consistent with production**
- **Allow testing of error states for demonstrations**

## Performance Rules

### 1. Loading Experience

- **Simulate realistic loading times** (brief but noticeable)
- **Implement all loading indicators** from the production version
- **Ensure smooth transitions** between loading and loaded states
- **Cache mock data appropriately** to avoid performance issues
- **Add artificial delays consistent with operation complexity**

### 2. Resource Usage

- **Keep bundle size minimal** by removing unused dependencies
- **Optimize mock asset sizes** for quick loading
- **Ensure responsive performance** on demo devices
- **Minimize memory usage** for reliable demonstrations
- **Avoid console errors and warnings** that might be visible

## Investor Presentation Rules

### 1. Demonstration Flow

- **Optimize for key user journeys** most likely to be shown
- **Ensure consistent state** between demonstration sections
- **Prepare "happy path" data** for smooth demonstrations
- **Include impressive but realistic examples** in mock data
- **Make role switching easy** for demonstrating different perspectives

### 2. Edge Case Handling

- **Gracefully handle unexpected inputs** during demonstrations
- **Prevent demonstration-breaking errors** with fallbacks
- **Provide reset options** if a demonstration goes off track
- **Ensure mock data covers likely demonstration scenarios**
- **Prepare alternative paths** for flexible presentations

## Authentication Rules

### 1. Mock Authentication

- **Allow instant login** with predefined credentials
- **Provide sample users for each role** (customer, employee, manager)
- **Simulate session management** including expiration
- **Maintain authentication UI** identical to production
- **Implement visual feedback** for authentication actions

### 2. Role-Based Access

- **Enforce role-based UI differences** consistent with production
- **Restrict access to role-specific pages** based on user role
- **Maintain the same navigation options** based on user type
- **Display role-appropriate content** throughout the application
- **Simulate permission checking** for sensitive operations

## Integration Presentation Rules

### 1. Third-Party Integration Display

- **Show realistic integration connection status**
- **Display mock data from "connected" services**
- **Simulate connection/disconnection processes**
- **Maintain visual elements of integration components**
- **Create believable representation of external data**

### 2. Google Workspace Representation

- **Show realistic file lists for Google Drive**
- **Display plausible calendar events for Google Calendar**
- **Present believable task lists for Google Tasks**
- **Maintain the same UI components as the real integration**
- **Simulate the connection status and authentication flow**

## Deployment Rules

### 1. Vercel Configuration

- **Optimize for Vercel deployment**
- **Minimize environment variable requirements**
- **Ensure static generation works where appropriate**
- **Configure build settings for optimal performance**
- **Test deployment prior to investor presentations**

### 2. Environment Setup

- **Document all necessary environment variables**
- **Provide default mock values for required settings**
- **Create a simplified deployment process**
- **Ensure repeatable builds** for consistent demonstrations
- **Minimize external dependencies** for reliable operation

## Documentation Rules

### 1. Code Documentation

- **Comment all mock implementations clearly**
- **Document simulation behaviors and limitations**
- **Explain artificial delays and their purpose**
- **Provide context for mock data design choices**
- **Include references to production implementations**

### 2. User Documentation

- **Create simple login instructions** for demonstration users
- **Document role-specific features** accessible in the wireframe
- **Provide notes on wireframe limitations** if needed
- **Include guidance for presenters** on optimal demonstration flows
- **Document reset procedures** if demonstration issues occur
