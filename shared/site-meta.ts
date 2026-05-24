import { commonLocal } from "@/shared/data/common";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import { PRODUCTION_SITE_ORIGIN } from "@/shared/site-remote";

/** Public site URL with no trailing slash — set in `.env` for correct Open Graph / Twitter cards. */
export const SITE_NAME = commonLocal.site.name;

export const SITE_TITLE = commonLocal.site.title;

export const SITE_DESCRIPTION = commonLocal.site.description;

export const SITE_KEYWORDS = commonLocal.site.keywords;

/** Brand mark under `public/images/` (served as `/images/...`). */
export const LOGO_PATH = "/images/logo.png";

/** One resolved URL per payload for `<Image />` / header (avoids repeated `resolveImageSrc` work). */
let cachedLogoSrcUi: string | null = null;
export function getCachedLogoSrcForUi(): string {
  if (cachedLogoSrcUi == null) {
    cachedLogoSrcUi = resolveImageSrc(LOGO_PATH);
  }
  return cachedLogoSrcUi;
}

/** Logo URL for favicon / JSON-LD (same resolved CDN path as UI). */
let cachedLogoSrcMeta: string | null = null;
export function getCachedLogoSrcForMeta(): string {
  if (cachedLogoSrcMeta == null) {
    cachedLogoSrcMeta = resolveImageSrc(LOGO_PATH);
  }
  return cachedLogoSrcMeta;
}

/**
 * Opens this listing in the Google Maps app / full site (photos, hours, reviews, etc.).
 * Prefer your official short link; override with `NEXT_PUBLIC_GOOGLE_MAPS_PLACE_URL`.
 */
export const GOOGLE_MAPS_PLACE_URL =
  "https://maps.app.goo.gl/sZHcGWbwk4apD5gy5";

/**
 * Google Maps iframe `src` for the Our Story embed.
 * Default uses the same listing as the full place page with `output=embed` so the embedded map
 * stays tied to the business. For pixel-perfect parity with Google’s UI, paste **Share → Embed a map**
 * into `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC`.
 */
export const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.902397697762!2d76.9735157!3d28.5125841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d11e6175c0167%3A0xf5371ab99f43e446!2sThe%20Bhukkad%20Junction!5e0!3m2!1sen!2sin!4v1779026229158!5m2!1sen!2sin";

/**
 * Absolute URL when `NEXT_PUBLIC_SITE_URL` is set.
 * In **development**, if unset, falls back to `PRODUCTION_SITE_ORIGIN` so localhost matches production links.
 */
export function absoluteSiteUrl(path: string): string | undefined {
  if (/^https?:\/\//i.test(path)) return path;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development"
      ? PRODUCTION_SITE_ORIGIN
      : undefined);
  if (!base) return undefined;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function restaurantJsonLd(): string {
  const url = absoluteSiteUrl("/");
  const logoResolved = getCachedLogoSrcForMeta();
  const imageAbs = /^https?:\/\//i.test(logoResolved)
    ? logoResolved
    : absoluteSiteUrl(logoResolved);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    servesCuisine: commonLocal.site.jsonLdServesCuisine,
    image: imageAbs ?? logoResolved,
    areaServed: {
      "@type": "City",
      name: commonLocal.site.areaServedName,
      alternateName: commonLocal.site.areaServedAlternateName,
    },
  };
  if (url) data.url = url;
  return JSON.stringify(data);
}
