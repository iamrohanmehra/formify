/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Image Optimization
  images: {
    domains: [],
    // Use minimized Image Optimization for better performance in India
    minimumCacheTTL: 60,
    // Fast deployment in all regions including India
    formats: ["image/webp"],
  },
  // Optimize for faster builds and deployments
  compress: true,
  // Enable React strict mode for better development
  reactStrictMode: true,
};

module.exports = nextConfig;
