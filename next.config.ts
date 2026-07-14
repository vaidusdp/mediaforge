import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: 70 * 1024 * 1024,
  },
  reactCompiler: true,
};

export default nextConfig;
