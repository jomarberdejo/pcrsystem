import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    } else if (config.resolve) {
      config.resolve.alias = {
        '@': path.resolve(__dirname, 'src'),
      };
    }
    return config;
  },
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
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
