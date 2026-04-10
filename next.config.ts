import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  devIndicators: {
    buildActivity: false, // Hide build activity indicator
  },
};

export default nextConfig;
