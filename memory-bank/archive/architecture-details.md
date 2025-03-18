# Architecture Details

**File Purpose**: Archive detailed information about system architecture that's referenced from core files  
**Related Files**: [systemPatterns.md](../systemPatterns.md), [techContext.md](../techContext.md)  
**Navigation**: For complete memory bank navigation, see [index.md](../index.md)

## Core Integration Components

### Integration Manager

The central coordination service responsible for managing all integration adapters, authentication, and synchronization:

```mermaid
classDiagram
    class IntegrationManager {
        -Map~string, BaseAdapter~ adapters
        -CredentialsManager credentialsManager
        +registerAdapter(string, BaseAdapter)
        +getAdapter~T~(string) T
        +scheduleSync(string, string, SyncOptions) Promise~JobResult~
        +processWebhook(string, WebhookEvent) Promise~void~
        +updateCredentials(string, ServiceCredentials) Promise~void~
        +checkIntegrationStatus(string) Promise~IntegrationStatus~
    }
    
    class BaseAdapter {
        <<abstract>>
        #string serviceName
        #CacheManager cacheManager
        #ServiceCredentials credentials
        +fetchResource~T~(string, string, FetchOptions) Promise~T~
        +fetchResources~T~(string, QueryOptions) Promise~T[]~
        +createResource~T~(string, any) Promise~T~
        +updateResource~T~(string, string, any) Promise~T~
        +deleteResource(string, string) Promise~void~
        +syncToCache(string, SyncOptions) Promise~SyncResult~
        +invalidateCache(string, string?) Promise~void~
        +getCachedResource~T~(string, string) Promise~T~
        +getCachedResources~T~(string, QueryOptions) Promise~T[]~
        +authenticate() Promise~AuthResult~
        +refreshAuthentication() Promise~AuthResult~
        +checkAuthStatus() AuthStatus
        +getServiceCapabilities() ServiceCapabilities
    }
    
    class SyncJob {
        -BaseAdapter adapter
        -string resourceType
        -SyncOptions options
        -RetryStrategy retryStrategy
        +start() Promise~SyncResult~
        +pause() void
        +resume() Promise~void~
        +cancel() Promise~void~
        +getStatus() SyncJobStatus
        +onProgress(ProgressCallback) void
        +onComplete(CompletionCallback) void
        +onError(ErrorCallback) void
    }
    
    IntegrationManager --> BaseAdapter : manages
    IntegrationManager --> SyncJob : schedules
    BaseAdapter <|-- CurrentRMSAdapter : implements
    BaseAdapter <|-- GoogleWorkspaceAdapter : implements
    BaseAdapter <|-- DocuSignAdapter : implements
```

### Google Workspace Adapter Architecture

The Google Workspace adapter has been simplified to focus on Drive functionality:

```mermaid
classDiagram
    class GoogleWorkspaceAdapter {
        -OAuth2Client oAuth2Client
        -DriveService driveService
        -boolean initialized
        +constructor(credentials?)
        +getOAuth2Client() OAuth2Client
        +initialize(userId) Promise~void~
        +isInitialized() boolean
        +fetchResources~T~(resourceType, queryOptions) Promise~T[]~
        +fetchResource~T~(resourceType, id, options) Promise~T~
        +createResource~T~(resourceType, data) Promise~T~
        +updateResource~T~(resourceType, id, data) Promise~T~
        +deleteResource(resourceType, id) Promise~void~
        +authenticate() Promise~AuthResult~
        +refreshAuthentication() Promise~AuthResult~
        +checkAuthStatus() Promise~AuthStatus~
        +getServiceCapabilities() ServiceCapabilities
    }
    
    class DriveService {
        -GoogleWorkspaceAdapter adapter
        -drive_v3.Drive driveApi
        +getFile(fileId, options) Promise~File~
        +listFiles(query) Promise~File[]~
        +createFolder(data) Promise~File~
        +createFile(data) Promise~File~
        +updateFile(fileId, data) Promise~File~
        +deleteFile(fileId) Promise~void~
        +syncFiles(options) Promise~SyncResult~
    }
    
    GoogleWorkspaceAdapter --> DriveService : uses
```

### Service-Specific Adapters

Each external service has its own adapter implementation that extends the base adapter:

```mermaid
flowchart TD
    BaseAdapter[Base Adapter] --> CurrentRMS[Current RMS Adapter]
    BaseAdapter --> Google[Google Workspace Adapter]
    BaseAdapter --> DocSign[DocuSign Adapter]
    BaseAdapter --> QB[QuickBooks Adapter]
    BaseAdapter --> Social[Social Media Adapters]
    
    subgraph "Adapter Responsibilities"
        Auth[Authentication]
        Transform[Data Transformation]
        Cache[Cache Management]
        ErrorHandling[Error Handling]
        Retry[Retry Logic]
    end
    
    CurrentRMS --> Auth
    CurrentRMS --> Transform
    CurrentRMS --> Cache
    CurrentRMS --> ErrorHandling
    CurrentRMS --> Retry
    
    Google --> Auth
    Google --> Transform
    Google --> Cache
    Google --> ErrorHandling
    Google --> Retry
```

### Cache Tables Structure

Supabase tables serve as a cache layer for external data with a consistent schema pattern:

```mermaid
erDiagram
    integration_cache_metadata {
        string service_name PK
        string resource_type PK
        timestamp last_full_sync
        timestamp last_incremental_sync
        int version
        string sync_status
        string error_message
    }
    
    current_rms_equipment {
        string id PK
        jsonb original_data
        string name
        string category
        int quantity
        decimal daily_rate
        timestamp last_synced_at
        string sync_status
        string etag
        int version
    }
    
    current_rms_rentals {
        string id PK
        jsonb original_data
        string customer_id FK
        date start_date
        date end_date
        decimal total_amount
        string status
        timestamp last_synced_at
        string sync_status
        int version
    }
    
    google_calendar_events {
        string id PK
        string calendar_id
        string summary
        text description
        string location
        timestamp start_time
        timestamp end_time
        timestamp created_at
        timestamp updated_at
        string status
        jsonb attendees
        jsonb original_data
        timestamp last_synced_at
        string etag
        uuid user_id FK
    }
    
    google_drive_files {
        string id PK
        string name
        string mime_type
        string parent_folder_id
        bigint size_bytes
        string web_view_link
        string thumbnail_link
        timestamp created_at
        timestamp modified_at
        boolean is_trashed
        jsonb original_data
        timestamp last_synced_at
        string etag
        uuid user_id FK
    }
    
    google_task_lists {
        string id PK
        string title
        timestamp updated_at
        jsonb original_data
        timestamp last_synced_at
        string etag
        uuid user_id FK
    }
    
    google_tasks {
        string id PK
        string task_list_id FK
        string title
        text notes
        timestamp due_date
        string status
        timestamp completed_at
        string position
        string parent_id
        jsonb original_data
        timestamp last_synced_at
        string etag
        uuid user_id FK
    }
    
    oauth_credentials {
        string service_name PK
        uuid user_id PK
        jsonb credentials
        timestamp created_at
        timestamp updated_at
    }
    
    integration_cache_metadata ||--o{ current_rms_equipment : tracks
    integration_cache_metadata ||--o{ current_rms_rentals : tracks
    integration_cache_metadata ||--o{ google_calendar_events : tracks
    integration_cache_metadata ||--o{ google_drive_files : tracks
    integration_cache_metadata ||--o{ google_task_lists : tracks
    integration_cache_metadata ||--o{ google_tasks : tracks
    google_task_lists ||--o{ google_tasks : contains
```

### Google Workspace Integration Architecture

```mermaid
flowchart TD
    User[User] -->|Connect Account| OAuth[OAuth Flow]
    OAuth -->|Store Tokens| CredStore[Credential Storage]
    
    UI[Employee Dashboard] -->|View Calendar| CalendarComp[Calendar Component with Placeholder]
    UI -->|View Drive| DriveComp[Drive Component]
    UI -->|View Tasks| TasksComp[Task Component with Placeholder]
    
    CalendarComp -->|API Request| CalendarRoute[/api/calendar]
    DriveComp -->|API Request| DriveRoute[/api/drive]
    TasksComp -->|API Request| TasksRoute[/api/tasks]
    
    CalendarRoute -->|503 Response| UnavailableMsg[Service Unavailable Message]
    DriveRoute --> GWAdapter[Google Workspace Adapter]
    TasksRoute -->|503 Response| UnavailableMsg
    
    GWAdapter -->|Fetch/Cache| DriveSvc[Drive Service]
    
    DriveSvc -->|API Calls| GoogleAPI[Google APIs]
    
    DriveSvc -->|Cache| DriveDB[Drive Cache]
    
    CredStore -->|Provide Tokens| GWAdapter
```

### Project Structure

The integration code is organized in a modular structure to maximize maintainability:

```
/frontend
  /lib
    /integrations
      /core                # Core framework
      /adapters            # Service-specific adapters
        /current-rms
        /google-workspace
          /index.ts        # Main adapter
          /auth.ts         # Authentication utilities
          /services        # Service-specific implementations
            /calendar.ts
            /drive.ts
            /tasks.ts
        /docusign
        /quickbooks
      /cache               # Cache utilities
      /auth                # Auth utilities
      /utils               # Shared utilities
  /app
    /api
      /integrations        # API routes
        /google-workspace
          /auth            # Authentication routes
          /calendar        # Calendar API routes (returns 503)
          /drive           # Drive API routes
          /tasks           # Tasks API routes (returns 503)
      /webhooks            # Webhook endpoints
```

## Data Synchronization Architecture

```mermaid
flowchart TD
    Initial[Initial Load] --> Scheduled[Scheduled Refresh]
    Scheduled --> Webhook[Webhook Updates]
    Webhook --> ActionBased[Action-Based Refresh]
    
    subgraph "Invalidation Strategies"
        Time[Time-Based]
        Version[Version-Based]
        Action[Action-Based]
        Dependency[Dependency-Based]
    end
