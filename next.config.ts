import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['imagedelivery.net', 'token-icons.s3.amazonaws.com'],
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add fallbacks for node: protocol modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      url: require.resolve('url/'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
    };

    return config;
  },
};

export default nextConfig;