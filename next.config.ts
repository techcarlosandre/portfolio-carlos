import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio-carlos",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
