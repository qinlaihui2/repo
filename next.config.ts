import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-syntax-highlighter", "react-markdown", "remark-gfm"],
};

export default nextConfig;
