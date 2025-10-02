import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongodb'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      mongodb: 'mongodb',
    },
  },
  webpack: (config) => {
    config.externals.push({
      'mongodb': 'commonjs mongodb',
    });
    return config;
  },
};

export default nextConfig;
