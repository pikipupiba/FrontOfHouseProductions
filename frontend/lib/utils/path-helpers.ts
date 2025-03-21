/**
 * Path Helper Utilities
 * 
 * This file contains helper functions for checking path types
 * to assist with middleware routing decisions.
 */

/**
 * Check if a path is for a static asset (images, fonts, etc.)
 */
export function isStaticPath(path: string): boolean {
  return (
    path.startsWith('/_next/static/') ||
    path.startsWith('/_next/image') ||
    path.startsWith('/images/') ||
    path.startsWith('/assets/') ||
    path.startsWith('/fonts/') ||
    path.endsWith('.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.svg') ||
    path.endsWith('.gif') ||
    path.endsWith('.webp') ||
    path.endsWith('.css') ||
    path.endsWith('.js')
  );
}

/**
 * Check if a path is for a Next.js prefetch request
 */
export function isPrefetchPath(path: string): boolean {
  return (
    path.includes('/_next/data/') ||
    path.startsWith('/_next/webpack-hmr') ||
    path.startsWith('/_next/static/')
  );
}

/**
 * Check if a path is for an error page
 */
export function isErrorPath(path: string): boolean {
  return (
    path.startsWith('/_error') ||
    path.startsWith('/404') ||
    path.startsWith('/500')
  );
}

/**
 * Check if a path is for an API route
 */
export function isApiPath(path: string): boolean {
  return path.startsWith('/api/');
}

/**
 * Check if a path is for an authentication route
 */
export function isAuthPath(path: string): boolean {
  return (
    path.startsWith('/auth/') ||
    path.startsWith('/api/auth/') ||
    path === '/login' ||
    path === '/signup' ||
    path === '/auth/callback'
  );
}

/**
 * Check if a path requires authentication
 */
export function isProtectedPath(path: string): boolean {
  return (
    path.startsWith('/dashboard') ||
    path.startsWith('/account') ||
    path.startsWith('/admin') ||
    (path.startsWith('/api/') &&
      !path.startsWith('/api/auth/') &&
      !path.startsWith('/api/public/'))
  );
}
