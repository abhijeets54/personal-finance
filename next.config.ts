import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for serverless deployment
  serverExternalPackages: ['mongodb'],

  // Image optimization settings
  images: {
    // Optimize for Vercel deployment
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Webpack optimization for serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Optimize MongoDB driver for serverless
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        'aws4': 'commonjs aws4',
        'snappy': 'commonjs snappy',
        'kerberos': 'commonjs kerberos',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
      });
    }
    return config;
  },

  // Output configuration for Vercel
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
