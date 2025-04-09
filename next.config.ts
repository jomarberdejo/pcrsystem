import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        // pathname: '/account123/**',
        search: '',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb" //WILL ADJUST THIS TO CHOOSE API OR SERVER ACTIONS IN HANDLING FORMS
    }
  }
};

export default nextConfig;
