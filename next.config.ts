import type { NextConfig } from "next";

const productionSite =
  process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
  "https://thebhukkadjunction.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination:
          "https://hmwj9hql4qgiypy7.public.blob.vercel-storage.com/:path*",
      },
      {
        source: "/site-copy/cdn/common.json",
        destination: `${productionSite}/common.json`,
      },
      {
        source: "/site-copy/cdn/menu.json",
        destination: `${productionSite}/cdn/menu.json`,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(productionSite).hostname,
        pathname: "/assets/images/**",
      },
    ],
  },
  compiler: {
    /** Strip `console.*` from production client & server bundles (dev unchanged). */
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
