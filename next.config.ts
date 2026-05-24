import type { NextConfig } from "next";
import {
  nextImageMinimumCacheTtlSeconds,
  staticSiteJsonCacheControl,
} from "./lib/site-asset-cache";
import { IMAGE_ASSETS_ROOT, VERCEL_BLOB_PUBLIC_ORIGIN } from "./shared/image-assets-root";

const productionSite =
  process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
  "https://thebhukkadjunction.com";

/** `next/image` allowlist only when `IMAGE_ASSETS_ROOT` is an absolute URL (blob uses same-origin `/cdn/…`). */
function imageAssetsRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }
  | null {
  const raw = IMAGE_ASSETS_ROOT.trim();
  if (!raw.startsWith("http")) return null;
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
        destination: `${VERCEL_BLOB_PUBLIC_ORIGIN}/:path*`,
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
