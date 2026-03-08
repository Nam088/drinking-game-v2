import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/v2',
        permanent: false, // Set false to allow reversing in the future
      },
    ];
  },
};

export default nextConfig;
