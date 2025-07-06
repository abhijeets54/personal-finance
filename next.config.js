/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB
  },
  // Ensure environment variables are available during build time
  experimental: {
    serverComponentsExternalPackages: ['mongodb']
  }
};

module.exports = nextConfig; 