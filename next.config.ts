import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* additional Railway / Docker deployment optimizations */
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
