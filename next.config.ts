import type { NextConfig } from "next";

const productionSite =
  process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
  "https://thebhukkadjunction.com";

/** `next/image` remote host/path — only from image env (same keys as `resolveImageSrc`). */
function imageAssetsRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }
  | null {
  const raw =
    process.env.NEXT_PUBLIC_IMAGE_ASSETS_BASE?.trim() ||
    process.env.NEXT_PUBLIC_ASSETS_IMAGES_BASE?.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const pathname = url.pathname.replace(/\/$/, "") || "";
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      pathname: pathname ? `${pathname}/**` : "/**",
    };
  } catch {
    return null;
  }
}

const imageRemote = imageAssetsRemotePattern();

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
    ...(imageRemote ? { remotePatterns: [imageRemote] } : {}),
  },
  compiler: {
    /** Strip `console.*` from production client & server bundles (dev unchanged). */
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
