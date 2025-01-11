import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['imagedelivery.net', 'token-icons.s3.amazonaws.com'],
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