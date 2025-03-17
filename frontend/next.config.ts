import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic image optimization
  images: {
    domains: ['example.com', 'lh3.googleusercontent.com'],
  },
  // Essential for development
  reactStrictMode: true,
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
