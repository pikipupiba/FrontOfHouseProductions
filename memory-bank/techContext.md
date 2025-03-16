# Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context API + React Query
- **UI Components**: Custom components built with Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Data Fetching**: SWR or React Query

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL (managed by Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
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
- @supabase/supabase-js
- @supabase/auth-helpers-nextjs

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
- Integration Tests: Cypress
- E2E Tests: Playwright
- Performance Testing: Lighthouse CI
