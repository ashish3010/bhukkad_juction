import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    /** Strip `console.*` from production client & server bundles (dev unchanged). */
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
