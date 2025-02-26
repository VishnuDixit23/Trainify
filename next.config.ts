import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  devIndicators: {
    buildActivity: false, // Hide build activity indicator
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        client: {
          overlay: false, // Disable error overlay
        },
      };
    }
    return config;
  },
};

export default nextConfig;
