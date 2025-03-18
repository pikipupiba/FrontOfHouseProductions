# Google Workspace Integration

This document outlines the Google Workspace integration for Front of House Productions.

## Overview

The Google Workspace integration allows employees and managers to access their Google Calendar, Drive, and Tasks directly from within the application. This integration facilitates better coordination, document sharing, and task management.

## Implementation Details

### Architecture

The integration follows our standard adapter pattern to ensure consistency with other external service integrations:

```
GoogleWorkspaceAdapter (extends BaseAdapter)
  ├── CalendarService
  ├── DriveService
  └── TasksService
```

### Database Schema

Google Workspace data is cached in the following tables:
- `integration_cache.google_calendar_events`
- `integration_cache.google_drive_files`
- `integration_cache.google_task_lists`
- `integration_cache.google_tasks`
- `integration_cache.oauth_credentials`

### Access Points

Users can access Google Workspace features from:

- **Employee Dashboard**: Direct links to Calendar, Drive, and Tasks
- **Manager Dashboard**: Direct links to Calendar, Drive, and Tasks

### Authentication Flow

1. User signs in to the application
2. The system checks if the user signed in with Google
   - If yes, the system attempts to reuse the authentication for workspace access
   - If no, the user must explicitly connect their Google account
3. On first connection, the user grants permissions for the required scopes:
   - Calendar: `https://www.googleapis.com/auth/calendar.events`
   - Drive: `https://www.googleapis.com/auth/drive.file`
   - Tasks: `https://www.googleapis.com/auth/tasks`

## Troubleshooting

### Authentication Issues

If a user encounters authentication errors:

1. Ensure the user has granted all required permissions
2. Check if there are existing OAuth credentials in the `integration_cache.oauth_credentials` table
3. Try disconnecting and reconnecting the Google account

### Database Errors

If database errors occur during authentication:

1. Ensure the user has a valid profile in the `profiles` table
2. Verify the user has a role assigned in the `user_roles` table
3. Check that Google Workspace migrations (008_google_workspace_integration.sql) have been applied

### API Rate Limits

The integration includes exponential backoff retry logic to handle rate limiting gracefully.

## Security Considerations

- OAuth tokens are stored securely in the database with proper encryption
- Row-level security ensures users can only access their own data
- The integration follows the principle of least privilege, requesting only the scopes it needs

## Future Enhancements

- Add support for Gmail integration
- Enable collaborative document editing
- Implement webhooks for real-time calendar updates
