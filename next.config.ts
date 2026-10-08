import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubActions ? "/portfolio-carlos" : "");

const nextConfig: NextConfig = {
  output: isGithubActions || process.env.BUILD_STANDALONE !== "true" ? "export" : "standalone",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;


