/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Image Optimization
  images: {
    domains: [],
    // Use reduced cache TTL for more frequent updates
    minimumCacheTTL: 30,
    // Fast deployment in all regions including India
    formats: ["image/webp"],
  },
  // Optimize for faster builds and deployments
  compress: true,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Disable static page generation and only use Server-Side Rendering for admin routes
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
