import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore - Ignore linting during build phase for Railway deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["pdf-parse", "@prisma/client"],
};

export default nextConfig;
