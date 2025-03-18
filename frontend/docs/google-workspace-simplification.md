# Google Workspace Integration Simplification

## Overview

This document outlines the simplification of the Google Workspace integration in the Front of House Productions application. The integration has been scaled back to focus only on Google Drive functionality, while maintaining placeholders for Calendar and Tasks features for future implementation.

## Changes Made

### 1. UI Components

- **Google Calendar**: Replaced with a placeholder component showing a "Coming Soon" badge
- **Google Tasks**: Replaced with a placeholder component showing a "Coming Soon" badge
- **Google Drive**: Maintained full functionality

### 2. API Routes

- **Calendar Routes**: Simplified to return 503 Service Unavailable responses
- **Tasks Routes**: Simplified to return 503 Service Unavailable responses
- **Drive Routes**: Maintained full functionality
- **Auth Routes**: Maintained full functionality (needed for Drive access)

### 3. Service Adapter

- Modified `GoogleWorkspaceAdapter` to only initialize and use the Drive service
- Calendar and Tasks service references preserved but not instantiated
- Error handlers updated to provide informative messages for the unavailable services

## Technical Implementation

### UI Placeholders

The Calendar and Tasks UI components are implemented as static placeholders with:

- "Coming Soon" badges for clear user communication
- Informative messages about temporary unavailability
- Visual placeholder elements that maintain the UI layout
- Links to the respective Google services for direct access

### Error Handling

When Calendar or Tasks functionality is requested:

1. API routes return HTTP 503 (Service Unavailable) status
2. Informative error messages direct users to use Google Drive instead
3. Backend adapter throws service-specific exceptions for unavailable resources

### Drive Functionality

All Google Drive functionality remains fully operational:

- File/folder listing
- File uploads and downloads
- Folder creation
- File sharing and permissions

## Future Re-enablement

To re-enable the Calendar and Tasks integrations in the future:

1. Remove the placeholder UI components
2. Restore the functional UI components
3. Update the API routes to use the real service implementations
4. Update the `GoogleWorkspaceAdapter` to initialize and use all services

This modular approach ensures that we can maintain a working Google Drive integration while allowing for seamless re-enablement of other Google Workspace services when they're ready.
