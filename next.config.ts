import type { NextConfig } from "next";
import {
  nextImageMinimumCacheTtlSeconds,
  staticSiteJsonCacheControl,
} from "./lib/site-asset-cache";

const productionSite =
  process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
  "https://thebhukkadjunction.com";

/** `next/image` allowlist: host/path parsed from **`NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX`** when it is an absolute URL. */
function imageAssetsRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }
  | null {
  const raw = process.env.NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX?.trim() || "";
  if (!raw || /^[?&]/.test(raw) || raw.includes("=")) return null;
  if (!/^https?:\/\//i.test(raw)) return null;
  try {
    const url = new URL(raw);
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
    minimumCacheTTL: nextImageMinimumCacheTtlSeconds(),
    ...(imageRemote ? { remotePatterns: [imageRemote] } : {}),
  },
  async headers() {
    const longLocalAssets = "public, max-age=86400, stale-while-revalidate=604800";
    const logoImmutable = "public, max-age=31536000, immutable";
    return [
      {
        source: "/static/:path*",
        headers: [{ key: "Cache-Control", value: staticSiteJsonCacheControl() }],
      },
      {
        source: "/images/logo.png",
        headers: [{ key: "Cache-Control", value: logoImmutable }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: longLocalAssets }],
      },
    ];
  },
  compiler: {
    /** Strip `console.*` from production client & server bundles (dev unchanged). */
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
