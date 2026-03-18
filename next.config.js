/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for all routes (Vercel will handle this)
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
