import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure CSS is included in the build
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
