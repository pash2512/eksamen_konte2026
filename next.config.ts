import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 1. Enable instrumentation hook to run polyfills on startup
  experimental: {
    instrumentationHook: true,
  },
  // 2. Turbopack is disabled in package.json dev, let's also disable in build just in case
  // although it should be disabled by default in Next 15 production build
};

export default nextConfig;
