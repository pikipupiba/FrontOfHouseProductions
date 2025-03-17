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

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `GOOGLE_API_KEY`: Google API key for Maps integration
- Various API keys for third-party services

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

### External Services
- Supabase (Database, Auth, Storage)
- Google Maps API
- Google Workspace API
- Web Push API for notifications
- Vercel for hosting and deployment

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

## Library Selection Strategy

Our approach to selecting libraries follows these principles:

1. **Prioritize Official Solutions**: Use libraries from Next.js, Vercel, and Supabase ecosystems first
2. **Prefer Active Maintenance**: Choose libraries with recent updates and active communities
3. **Bundle Size Awareness**: Monitor bundle sizes to maintain performance targets
4. **Accessibility Focus**: Ensure libraries support keyboard navigation and screen readers
5. **TypeScript Support**: All libraries must have good TypeScript definitions

This strategy ensures we build a robust application while maintaining performance and developer experience. The selected libraries provide a comprehensive foundation for all planned features while keeping the codebase maintainable and sustainable for the long term.
