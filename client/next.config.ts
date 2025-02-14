import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: "https",
        hostname: 'apimyhomegroup.onrender.com'
      }
    ],
  },
};

export default nextConfig;
