import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['imagedelivery.net','token-icons.s3.amazonaws.com'], // Add the hostname here
  },
  reactStrictMode: true,
};

export default nextConfig;
