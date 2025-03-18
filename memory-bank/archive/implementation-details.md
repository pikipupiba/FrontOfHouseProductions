# Implementation Details

**File Purpose**: Archive code-level implementation details that are referenced from core files  
**Related Files**: [systemPatterns.md](../systemPatterns.md), [architecture-details.md](architecture-details.md)  
**Navigation**: For complete memory bank navigation, see [index.md](../index.md)

## Integration Framework Implementation

The integration framework implements a comprehensive set of components to enable external service integration with consistent patterns, caching, and resilience.

### Core Integration Components Implementation

#### Integration Manager Implementation 

```typescript
export class IntegrationManager {
  private static instance: IntegrationManager;
  private adapters: Map<string, BaseAdapter> = new Map();
  private credentialsManager: CredentialsManager;
  private activeJobs: Map<string, SyncJob> = new Map();
  
  // Singleton pattern implementation
  public static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }
  
  // Adapter registration and retrieval
  public registerAdapter(adapter: BaseAdapter): void {...}
  public getAdapter<T extends BaseAdapter>(serviceName: string): T {...}
  
  // Credential management
  public async updateCredentials(serviceName: string, credentials: ServiceCredentials): Promise<void> {...}
  
  // Sync job scheduling
  public async scheduleSync(serviceName: string, resourceType: string, options?: SyncOptions): Promise<JobResult> {...}
  
  // Authentication handling
  public async handleOAuthCallback(serviceName: string, code: string, ...): Promise<ServiceCredentials> {...}
  
  // Webhook processing
  public async processWebhook(serviceName: string, event: {...}): Promise<void> {...}
}
```

#### Base Adapter Implementation

```typescript
export abstract class BaseAdapter {
  protected serviceName: string;
  protected credentials?: ServiceCredentials;
  
  // CRUD operations
  abstract fetchResource<T>(resourceType: string, id: string, options?: FetchOptions): Promise<T>;
  abstract fetchResources<T>(resourceType: string, query: QueryOptions): Promise<T[]>;
  abstract createResource<T>(resourceType: string, data: any): Promise<T>;
  abstract updateResource<T>(resourceType: string, id: string, data: any): Promise<T>;
  abstract deleteResource(resourceType: string, id: string): Promise<void>;
  
  // Cache operations
  abstract syncToCache(resourceType: string, options?: SyncOptions): Promise<SyncResult>;
  abstract invalidateCache(resourceType: string, id?: string): Promise<void>;
  abstract getCachedResource<T>(resourceType: string, id: string): Promise<T>;
  abstract getCachedResources<T>(resourceType: string, query: QueryOptions): Promise<T[]>;
  
  // Authentication
  abstract authenticate(): Promise<AuthResult>;
  abstract refreshAuthentication(): Promise<AuthResult>;
  abstract checkAuthStatus(): Promise<AuthStatus>;
  
  // Error handling
  protected createError(error: any, operation: string): IntegrationError {...}
  protected categorizeError(error: any): IntegrationErrorType {...}
  protected isRetryable(errorType: IntegrationErrorType, error: any): boolean {...}
}
```

#### Google Workspace Adapter Implementation

```typescript
export class GoogleWorkspaceAdapter extends BaseAdapter {
  private oauth2Client: any = null;
  private initialized: boolean = false;
  public driveService: DriveService;
  
  constructor() {
    super('google-workspace');
    this.driveService = new DriveService(this);
  }
  
  // OAuth client management
  public getOAuth2Client(): any {
    if (!this.oauth2Client) {
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: 'OAuth2 client not initialized',
        serviceName: this.getServiceName(),
        retryable: false
      });
    }
    
    return this.oauth2Client;
  }
  
  public async initialize(userId: string): Promise<void> {
    try {
      // Get OAuth client for this user
      this.oauth2Client = await getOAuthClient(userId);
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Google Workspace adapter:', error);
      this.initialized = false;
      throw new IntegrationError({
        type: IntegrationErrorType.AUTHENTICATION,
        message: `Failed to initialize Google Workspace adapter: ${error}`,
        serviceName: this.getServiceName(),
        retryable: false
      });
    }
  }
  
  // Check if initialized
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  // Adapter interface implementation with focus on Drive
  async fetchResource<T>(resourceType: string, id: string, options?: FetchOptions): Promise<T> {
    // Implementation that handles Drive resources and returns appropriate errors for Calendar/Tasks
  }
  
  async fetchResources<T>(resourceType: string, query: QueryOptions): Promise<T[]> {
    // Implementation that handles Drive resources and returns appropriate errors for Calendar/Tasks
  }
  
  // Additional adapter methods similarly implemented to handle only Drive with appropriate errors for Calendar/Tasks
}
```

#### Sync Job Implementation

```typescript
export class SyncJob {
  private jobId: string;
  private adapter: BaseAdapter;
  private resourceType: string;
  private options: SyncOptions;
  private retryStrategy: RetryStrategy;
  private status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' = 'pending';
  
  // Job control methods
  async start(): Promise<SyncResult> {...}
  pause(): void {...}
  async resume(): Promise<SyncResult> {...}
  cancel(): void {...}
  
  // Event handling
  onProgress(callback: ProgressCallback): SyncJob {...}
  onComplete(callback: CompletionCallback): SyncJob {...}
  onError(callback: ErrorCallback): SyncJob {...}
}
```

#### Retry Logic Implementation

```typescript
export class RetryStrategy {
  private maxAttempts: number;
  private baseDelay: number;
  private maxDelay: number;
  private factor: number;
  
  // Retry execution
  async execute<T>(fn: () => Promise<T>): Promise<T> {...}
  
  // Function decorator for retryable operations
  retryable<T, Args extends any[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {...}
}
```

#### Credentials Manager Implementation

```typescript
export class CredentialsManager {
  private static instance: CredentialsManager;
  private cache: Map<string, ServiceCredentials> = new Map();
  
  // Credential operations
  async storeCredentials(serviceName: string, credentials: ServiceCredentials): Promise<void> {...}
  async getCredentials(serviceName: string): Promise<ServiceCredentials> {...}
  async hasValidCredentials(serviceName: string): Promise<boolean> {...}
  async refreshOAuthToken(serviceName: string): Promise<ServiceCredentials> {...}
  
  // Security methods
  private encrypt(data: string): string {...}
  private decrypt(data: string): string {...}
}
```

### Database Schema Implementation

The database schema has been implemented in Supabase with the following tables:

1. **integration_credentials** - Securely stores API credentials
2. **integration_cache.metadata** - Tracks synchronization status
3. **integration_cache.current_rms_equipment** - Example cache table for Current RMS
4. **integration_cache.google_calendar_events** - Cache for Google Calendar events
5. **integration_cache.google_drive_files** - Cache for Google Drive files
6. **integration_cache.google_task_lists** - Cache for Google Task lists
7. **integration_cache.google_tasks** - Cache for Google Tasks

The schema includes proper RLS policies:
- Credentials accessible only by service role
- Cache tables viewable by authenticated users with proper user_id constraints
- Row-level security ensures users can only access their own data

## Integration Approach By Service Category

### Business Operations
- **Current RMS**: RESTful API integration with caching for customer data, inventory, and rental tracking
  - Caching approach: Full catalog sync weekly, incremental sync daily, real-time sync for bookings
  - Implementation priority: First priority, focusing on equipment and rental data
- **QuickBooks/Xero**: API integration for invoice management and financial data
  - Caching approach: Daily sync for invoices, real-time for payment status
  - Implementation priority: Medium-term, after core rental features

### Google Workspace Ecosystem
- **Google Calendar**: ⚠️ SIMPLIFIED
  - Implementation: Placeholder component with "Coming Soon" badge
  - API Routes: Return 503 Service Unavailable with informative message
  - Future Plans: Re-enable when stability issues are resolved
- **Google Drive**: ✅ IMPLEMENTED
  - Implementation: Full adapter with file browsing capabilities
  - Caching: Metadata cached in google_drive_files table
  - UI: File grid with appropriate icons by file type
  - Features: View and navigate files, folders with proper permissions
- **Google Tasks**: ⚠️ SIMPLIFIED
  - Implementation: Placeholder component with "Coming Soon" badge
  - API Routes: Return 503 Service Unavailable with informative message
  - Future Plans: Re-enable when stability issues are resolved
- **Gmail/Google Voice**: 📅 PLANNED
  - Caching approach: Minimal caching for templates and recent communications
- **Google Maps**: 📅 PLANNED
  - Caching approach: Geocoding results cached indefinitely, route data cached for 24 hours

### Document Management
- **DocuSign/Adobe**: API integration for document viewing, signing, and processing
  - Caching approach: Template caching, status sync every 15 minutes
  - Implementation priority: High priority for contract management features

### Social Media Management
- **Primary Platforms**: Unified API approach for content publishing and metrics collection
  - Caching approach: Metrics cached hourly, content status cached in real-time
  - Implementation priority: Low priority, later phase implementation

## Synchronization Mechanisms

1. **Initial Load**: Complete dataset on first user access
2. **Scheduled Refresh**: Background sync on configurable intervals based on data type
3. **Webhook Events**: Real-time updates when services provide webhooks
4. **Action-Based Refresh**: Cache invalidation after mutation operations
5. **Manual Refresh**: User-triggered refresh for critical data

## Cache Invalidation Approaches

1. **Time-Based**: Data expires after configured time period
2. **Version-Based**: Tracking version numbers for conflict detection
3. **Action-Based**: Invalidating specific entries after mutations
4. **Dependency-Based**: Cascading invalidation for related resources

## Error Handling & Resilience

- **Error Categorization**: Errors classified by type (authentication, rate limit, network, etc.)
- **Retry Strategy**: Exponential backoff with jitter for transient failures
- **Circuit Breaking**: Preventing cascading failures by temporarily disabling problematic integrations
- **Graceful Degradation**: Showing cached data with warning when live data unavailable
- **Service Status Indicators**: Clear UI indicators when services are temporarily unavailable
- **Monitoring**: Comprehensive logging of all integration operations with error tracking

## Authentication & Security

- **Credential Management**: Secure storage of API keys and tokens
- **OAuth Flows**: Standardized OAuth implementation for services requiring user authorization
- **Token Refresh**: Automatic refresh of expired tokens
- **Audit Logging**: Tracking all integration authentication events
- **Access Control**: Row-level security for cached data based on user roles
