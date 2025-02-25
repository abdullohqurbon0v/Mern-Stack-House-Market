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
      },
        {
        protocol: "https",
        hostname: 'mern-stack-house-market.onrender.com'
      }
    ],
  },
};

export default nextConfig;
