import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['imagedelivery.net', 'token-icons.s3.amazonaws.com'],
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: false  // Use browser's native URL API instead
      };
    }
    return config;
  },
};

export default nextConfig;