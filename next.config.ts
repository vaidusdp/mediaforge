import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: 70 * 1024 * 1024,
  },
  reactCompiler: true,
};

export default nextConfig;
