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
