import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow the higher-quality variant used for the portal UI screenshots
    // (fine text needs >75). Declaring it here is required from Next 16 on.
    qualities: [75, 92],
  },
};

export default nextConfig;
