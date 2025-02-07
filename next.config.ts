import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['imagedelivery.net', 'token-icons.s3.amazonaws.com','i.imgur.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value:
              "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals["node:url"] = "commonjs node:url";
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
  };
    config.plugins.push(

      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource:any) => {
          resource.request = resource.request.replace(/^node:/, '');
        },
      ),
    );

    return config;
 }
};

export default nextConfig;