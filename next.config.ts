import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['192.168.56.1', '192.168.0.0/16', '10.0.0.0/8'],
};

export default nextConfig;
