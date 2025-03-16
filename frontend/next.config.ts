import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allow images from common CDNs and storage services
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      // Add additional domains as needed
    ],
  },
  
  // Optimize for production build
  poweredByHeader: false,
  
  // Enable React strict mode for improved development experience
  reactStrictMode: true,
  
  // Improve performance with server components (default in Next.js 15)
  serverComponentsExternalPackages: [],
  
  // Configure trailing slashes (choose one based on preference)
  trailingSlash: false,
  
  // Add any environment variables that should be available to the browser
  env: {
    SITE_URL: 'https://frontofhouseproductions.com',
  },
};

export default nextConfig;
