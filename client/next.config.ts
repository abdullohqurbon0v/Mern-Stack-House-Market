import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.newhomeinc.com',
      },
    ],
  },
};

export default nextConfig;
