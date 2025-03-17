# Front of House Productions Update Guide

This guide documents the changes made to update the Front of House Productions website to work with the latest technologies and best practices.

## Summary of Updates

1. **Package Updates**
   - Updated React from 18.2.0 to 19.0.0
   - Updated Next.js from 13.5.4 to 15.2.2
   - Updated TypeScript from 5.x to 5.3.3
   - Updated all dev dependencies to their latest versions

2. **Configuration Changes**
   - Updated Next.js configuration in `next.config.ts`
   - Enhanced TypeScript configuration in `tsconfig.json`
   - Fixed TypeScript errors in components

3. **Code Improvements**
   - Added null checking and optional chaining for safer code
   - Improved type safety across components
   - Enhanced configuration for better performance and SEO

## Required Steps to Complete the Update

### 1. Install Node.js 20.x

Follow the instructions in `node_update_instructions.md` to install Node.js 20.x on your system.

### 2. Install Updated Dependencies

After Node.js is updated, run:

```bash
cd frontend
npm install
```

This will install all the updated dependencies specified in the package.json file.

### 3. Run the Development Server

```bash
cd frontend
npm run dev
```

## Key Technical Improvements

### Next.js 15 Features

The upgrade to Next.js 15 brings several improvements:

- **Enhanced Image Optimization**: Better support for modern image formats
- **Improved Server Components**: More efficient server rendering
- **App Router Improvements**: Better routing and navigation
- **Better TypeScript Integration**: Enhanced type safety

### React 19 Benefits

- **Improved Performance**: Better rendering and state management
- **Enhanced Developer Experience**: Improved debugging and error messages
- **Better Concurrent Mode Support**: More efficient handling of concurrent operations

### TypeScript Enhancements

- **Stricter Type Checking**: Added `noUncheckedIndexedAccess` for safer object access
- **Modern JavaScript Features**: Updated to ES2022 target
- **Better Field Declarations**: Using `useDefineForClassFields` for class fields

## Potential Issues to Watch For

1. **TypeScript Errors**: The stricter TypeScript configuration might reveal more type errors
2. **React Hook Dependencies**: React 19 is stricter about hook dependencies
3. **Server/Client Component Separation**: Ensure proper 'use client' directives where needed

## Next Steps

1. Review all components with the updated TypeScript configuration
2. Test thoroughly across different devices and browsers
3. Deploy to a staging environment before going to production

## Troubleshooting

### Simplified Configuration Approach

We've simplified the configuration files to ensure maximum compatibility and reduce potential issues:

1. **Simplified Next.js Configuration:**
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     // Basic image optimization
     images: {
       domains: ['example.com'],
     },
     // Essential for development
     reactStrictMode: true,
   };

   export default nextConfig;
   ```
   - Removed unsupported options like `serverComponentsExternalPackages`
   - Kept only essential configurations for development

2. **Simplified Tailwind Configuration:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```
   - Streamlined content paths
   - Removed unnecessary extensions and custom settings

3. **Standard PostCSS Configuration:**
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```
   - Switched to CommonJS format for better compatibility

4. **Fixed CSS Imports:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   /* Basic global styles */
   :root {
     --foreground-rgb: 0, 0, 0;
     --background-rgb: 255, 255, 255;
   }
   
   /* Rest of styling... */
   ```
   - Replaced incorrect `@import "tailwindcss"` with proper Tailwind directives

### Common Error Fixes

1. **PostCSS Module Error:**
   ```
   Error: Cannot find module '@tailwindcss/postcss'
   ```
   - Fixed by updating the PostCSS configuration to use the standard plugins format

2. **Next.js Config Warning:**
   ```
   Invalid next.config.ts options detected: 'serverComponentsExternalPackages'
   ```
   - Fixed by removing unsupported configuration options

3. **Tailwind Import Error:**
   ```
   Module not found: Can't resolve 'tailwindcss'
   ```
   - Fixed by using the proper Tailwind directives in CSS
