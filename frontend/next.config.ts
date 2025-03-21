import type { NextConfig } from "next";

/**
 * Next.js configuration for wireframe implementation
 * 
 * Simplified configuration with wireframe settings directly applied
 * without conditional logic for dual-mode support.
 */
const nextConfig: NextConfig = {
  // Image optimization with additional domains for placeholders
  images: {
    domains: [
      'example.com', 
      'lh3.googleusercontent.com',
      'i.pravatar.cc', // For avatar placeholders
      'placehold.co', // For placeholder images
      'localhost'
    ],
    // More permissive for demo images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure we include the mock directories in the build
  experimental: {
    // Uncomment for static export if needed
    // output: 'export',
    serverComponentsExternalPackages: [],
  },
  // Essential for development
  reactStrictMode: true,
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep API routes for the mock API implementation
  rewrites: async () => {
    return [
      // Redirect all API routes to mock implementations
      {
        source: '/api/:path*',
        destination: '/api/mock/:path*',
      },
    ];
  },
  // Set environment variables directly
  env: {
    NEXT_PUBLIC_WIREFRAME_MODE: 'true',
  },
};

export default nextConfig;
