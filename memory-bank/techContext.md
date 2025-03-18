# Technical Context

## Technology Stack

### Core Framework & Infrastructure
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Hosting**: Vercel
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **CI/CD**: Vercel GitHub Integration

### Frontend Libraries

#### UI & Styling
- **Styling Framework**: Tailwind CSS
- **UI Component Foundation**: 
  - radix-ui (for accessible headless components)
  - shadcn/ui (Tailwind components built on Radix primitives)
- **Icons**: Lucide React
- **Class Utilities**: tailwind-merge & clsx (for conditional styling)

#### Data Management
- **Server State**: TanStack Query (React Query) v5
- **Client State**: React Context API with zustand for complex state
- **Data Fetching**: TanStack Query with Supabase client
- **Form Handling**: React Hook Form
- **Validation**: Zod (for form and API schema validation)
- **Date Handling**: date-fns (lightweight date utilities)

#### File & Document Management
- **File Upload**: react-dropzone
- **Image Handling**: next/image with Supabase Storage URLs
- **PDF Handling**: react-pdf (for contracts/documents)
- **Document Viewers**: 
  - react-image-lightbox (for photos)
  - Plyr (for video playback)

#### Visualization & Interactive Components
- **Charts & Data Viz**: Recharts
- **Calendar & Scheduling**: react-big-calendar
- **Timeline Visualization**: react-calendar-timeline
- **Maps Integration**: Google Maps API with @react-google-maps/api

#### Animation & UI Enhancement
- **Transitions**: framer-motion (for more complex animations)
- **Toasts & Notifications**: react-hot-toast or sonner
- **Modals**: headlessui/react or radix-ui/dialog
- **Tooltips & Popovers**: @floating-ui/react

### Backend & API
- **Backend Platform**: Supabase
- **API Client**: @supabase/supabase-js
- **Auth Helpers**: @supabase/ssr (for Next.js integration)
- **Real-time Sync**: Supabase Realtime
- **File Storage**: @supabase/storage-js
- **Database**: PostgreSQL (managed by Supabase)
- **API**: RESTful + GraphQL via Supabase
- **Serverless Functions**: Next.js API Routes / Edge Functions

### Image Optimization & Configuration
- **Image Domains**: Configured in Next.js to allow:
  - `example.com` - Default example domain
  - `lh3.googleusercontent.com` - For Google profile pictures
- **Image Optimization**: Using Next.js built-in image optimization
- **Image Component**: Using next/image for automatic optimization

### Integration Architecture
- **Pattern**: Adapter pattern with consistent interfaces for all external services - ✅ IMPLEMENTED
- **Caching**: Supabase tables as cache layer with background sync jobs - ✅ IMPLEMENTED
- **Authentication**: Secure credential management with token refresh support - ✅ IMPLEMENTED
- **Data Sync**: Combination of webhooks and scheduled jobs with retry logic - ✅ IMPLEMENTED
- **Error Handling**: Categorized error types with appropriate retry strategies - ✅ IMPLEMENTED
- **Core Components**: ✅ IMPLEMENTED
  - Integration Manager: Central service for coordinating all integrations
  - BaseAdapter: Abstract class defining the integration interface
  - SyncJob: Background job processor for data synchronization
  - RetryStrategy: Exponential backoff with jitter for resilient operations
  - CredentialsManager: Secure handling of API credentials
  - WebhookHandler: Processes real-time updates from external services

### Infrastructure
- **Hosting**: Vercel
- **Version Control**: GitHub
- **CI/CD**: Vercel GitHub Integration
- **Monitoring**: Vercel Analytics
- **Environment Management**: Vercel Environments

## Development Setup

### Prerequisites
- Node.js (18.x or later)
- npm or yarn
- Git
- Supabase CLI
- Vercel CLI (optional)
- Windows 11 with PowerShell (current development environment)

### Local Development
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Windows-Specific Considerations
- **Working Directory Awareness**: Always be aware of the current working directory when executing commands. In PowerShell, use `Get-Location` or `pwd` to check the current directory.
- **Command Structure**: Avoid unnecessary directory changes (e.g., `cd frontend && npm test` when already in frontend directory)
- **File/Directory Operations**: Use PowerShell syntax for file operations:
  ```powershell
  # Creating directories
  New-Item -ItemType Directory -Path "path\to\dir"
  # or
  mkdir "path\to\dir"
  
  # Creating multiple directories (comma-separated, not space-separated)
  mkdir "dir1","dir2","dir3"
  
  # Creating files
  New-Item -ItemType File -Path "path\to\file"
  # or
  ni "path\to\file"
  
  # Creating nested directories (equivalent to mkdir -p in bash)
  New-Item -ItemType Directory -Path "path\to\nested\dir" -Force
  ```
- **Path Separators**: Windows uses backslashes (`\`) in paths, though forward slashes (`/`) often work in modern PowerShell
- **Command Differences**: Be aware of different command equivalents between bash and PowerShell

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `GOOGLE_API_KEY`: Google API key for Maps integration
- `CURRENT_RMS_API_KEY`: API key for Current RMS integration
- `CURRENT_RMS_SUBDOMAIN`: Subdomain for Current RMS account
- `DOCUSIGN_CLIENT_ID`: Client ID for DocuSign OAuth
- `DOCUSIGN_CLIENT_SECRET`: Client secret for DocuSign OAuth
- `DOCUSIGN_REDIRECT_URI`: Redirect URI for DocuSign OAuth flow
- `GOOGLE_OAUTH_CLIENT_ID`: Client ID for Google Workspace OAuth
- `GOOGLE_OAUTH_CLIENT_SECRET`: Client secret for Google OAuth
- `GOOGLE_OAUTH_REDIRECT_URI`: Redirect URI for Google OAuth flow
- Additional API keys for other third-party services

## Technical Constraints

### Performance
- Core Web Vitals targets:
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1
- Initial load budget: < 200KB (compressed)
- TTI (Time to Interactive): < 3.5s on 4G

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome for Android)
- IE11 is not supported

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Proper contrast ratios

### Mobile Responsiveness
- Mobile-first design approach
- Breakpoints:
  - Mobile: 0-640px
  - Tablet: 641px-1024px
  - Desktop: 1025px+

### Integration Constraints
- Rate Limiting: All external API calls must respect rate limits
- Caching Requirements: Critical data must be cached to reduce API calls
- API Credential Security: No credentials stored in client-side code
- Background Jobs: Sync jobs must be resilient to failures
- Offline Capability: Core features should work with stale cached data

## Dependencies

### Core Dependencies
- next
- react
- react-dom
- typescript
- tailwindcss
- @tanstack/react-query
- zustand (for complex state)
- @supabase/supabase-js
- @supabase/ssr
- react-hook-form
- zod
- date-fns
- tailwind-merge
- clsx
- lucide-react

### Integration Dependencies
- axios (for consistent API requests)
- current-rms-api (for Current RMS integration)
- node-quickbooks (for QuickBooks integration)
- googleapis (for Google Workspace integrations)
- docusign-esign (for DocuSign integration)
- @supabase/storage-js (for file storage)
- oauth4webapi (for standardized OAuth handling)
- jsonwebtoken (for token management)
- node-cache (for in-memory caching)
- p-retry (for intelligent retry logic)
- p-queue (for rate limiting and job queuing)
- node-cron (for scheduled jobs)
- webhook-validator (for webhook signature validation)

### UI & Visualization Dependencies
- @radix-ui/* components
- react-dropzone
- react-pdf
- react-image-lightbox
- recharts
- react-calendar-timeline
- react-big-calendar
- framer-motion
- react-hot-toast

### Development Dependencies
- eslint
- prettier
- typescript
- jest
- @testing-library/react
- @types/react
- @types/node
- postcss
- autoprefixer
- @playwright/test
- msw (for API mocking in tests)
- supertest (for API testing)
- mockdate (for date-based testing)

### External Services & Integrations

#### Core Services
- **Supabase**: Database, Auth, Storage
- **Vercel**: Hosting and deployment

#### Business Operations
- **Current RMS**: Customer data and inventory tracking
  - SDK: current-rms-api
  - Authentication: API key-based
  - Caching Strategy: Daily incremental sync, weekly full sync
  - Implementation Priority: High (first integration)
- **QuickBooks/Xero**: Invoice management
  - SDK: node-quickbooks or xero-node
  - Authentication: OAuth 2.0
  - Caching Strategy: Daily sync for invoices, real-time for payment status
  - Implementation Priority: Medium (after rental management)

#### Google Workspace Ecosystem
- **Google Tasks API**: Work assignments
  - SDK: googleapis
  - Authentication: OAuth 2.0
  - Caching Strategy: Hourly sync with webhook updates
  - Implementation Priority: Medium (for employee portal)
  - Implementation Status: ✅ COMPLETED
- **Google Calendar API**: Event scheduling
  - SDK: googleapis
  - Authentication: OAuth 2.0
  - Caching Strategy: Hourly sync for upcoming events
  - Implementation Priority: Medium (for event timelines)
  - Implementation Status: ✅ COMPLETED
- **Google Voice API**: Communication
  - Caching Strategy: Minimal caching, real-time preferred
  - Implementation Priority: Low
  - Implementation Status: 📅 PLANNED
- **Google Drive API**: Document storage
  - SDK: googleapis
  - Authentication: OAuth 2.0
  - Caching Strategy: Metadata cache, content fetched on demand
  - Implementation Priority: Medium (for document management)
  - Implementation Status: ✅ COMPLETED
- **Gmail API**: Email communications
  - Caching Strategy: Minimal caching for templates
  - Implementation Priority: Low
  - Implementation Status: 📅 PLANNED
- **Google Maps API**: Location services with @react-google-maps/api
  - Caching Strategy: Geocoding cached indefinitely, routes for 24 hours
  - Implementation Priority: Medium (for event locations)
  - Implementation Status: 📅 PLANNED

#### Document Management
- **DocuSign/Adobe**: Document signing
  - SDK: docusign-esign or adobe-sign-sdk
  - Authentication: OAuth 2.0
  - Caching Strategy: Template caching, status sync every 15 minutes
  - Implementation Priority: High (for contract management)

#### Social Media
- **Facebook & Instagram**: Meta Graph API
- **X/Twitter**: Twitter API v2
- **Snapchat**: Snap Marketing API
- **TikTok**: TikTok API for Business
- **Reddit**: Reddit API
- **YouTube**: YouTube Data API
- **Discord**: Discord Bot API
- **Yelp**: Yelp Fusion API
- **Google Business**: Google My Business API
- Implementation Priority: Low (later phase)

#### Other
- **Web Push API**: Browser notifications

## Build & Deployment

### Build Process
```bash
# Create production build
npm run build

# Run production build locally
npm start
```

### Deployment
- Continuous deployment via Vercel GitHub integration
- Preview deployments for pull requests
- Production deployment from main branch
- Database migrations run manually via Supabase CLI

## Testing Strategy
- Unit Tests: Jest + React Testing Library
- E2E Tests: Playwright
- Component Testing: Storybook (optional)
- Integration Tests: Playwright
- Performance Testing: Lighthouse CI
- API Mock Testing: MSW for simulating external services

## Integration Testing

- **Mock Servers**: MSW to simulate external API responses
- **Fixture Data**: Static fixture data for predictable testing
- **Environment Separation**: Dedicated testing environments for integrations
- **API Recording**: Record actual API responses for mock refinement
- **Webhooks Testing**: Simulated webhook events for testing handlers
- **Rate Limit Testing**: Tests for proper handling of rate limit responses
- **Credential Rotation**: Tests for token refresh and expiration handling

## Library Selection Strategy

Our approach to selecting libraries follows these principles:

1. **Prioritize Official Solutions**: Use libraries from Next.js, Vercel, and Supabase ecosystems first
2. **Prefer Active Maintenance**: Choose libraries with recent updates and active communities
3. **Bundle Size Awareness**: Monitor bundle sizes to maintain performance targets
4. **Accessibility Focus**: Ensure libraries support keyboard navigation and screen readers
5. **TypeScript Support**: All libraries must have good TypeScript definitions

This strategy ensures we build a robust application while maintaining performance and developer experience. The selected libraries provide a comprehensive foundation for all planned features while keeping the codebase maintainable and sustainable for the long term.

## Integration Implementation Approach

Our approach to implementing integrations follows these principles:

1. **Standardized Architecture**: All integrations follow the same adapter pattern
2. **Cache-First Strategy**: Prioritize cached data for performance with async updates
3. **Graceful Degradation**: Services should degrade gracefully when external APIs fail
4. **Comprehensive Logging**: Detailed logging of all integration operations
5. **Security-First**: Secure handling of all API credentials
6. **Progressive Enhancement**: Core functionality without integrations, enhanced with them

This implementation approach ensures consistent, reliable, and maintainable integrations across all external services while protecting the application from external dependencies.
