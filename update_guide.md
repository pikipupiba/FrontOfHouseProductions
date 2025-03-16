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

### PostCSS and Tailwind Configuration Fix

If you encounter the following error:
```
Error: Cannot find module '@tailwindcss/postcss'
```

This is related to the PostCSS configuration. We've fixed this by:

1. Updating `postcss.config.mjs` to use the standard format:
   ```js
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

2. Adding a proper `tailwind.config.js` file:
   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

These changes ensure that Tailwind CSS and PostCSS are correctly configured for use with Next.js 15.
