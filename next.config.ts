import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    qualities: [75, 85],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'], // Allow all origins for dev tunneling (ngrok, etc)
    }
  }
};

export default nextConfig;
