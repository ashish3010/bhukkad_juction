import { common } from "@/shared/data/common";

/** Public site URL with no trailing slash — set in `.env` for correct Open Graph / Twitter cards. */
export const SITE_NAME = common.site.name;

export const SITE_TITLE = common.site.title;

export const SITE_DESCRIPTION = common.site.description;

export const SITE_KEYWORDS = common.site.keywords;

/** Brand mark under `public/images/` (served as `/images/...`). */
export const LOGO_PATH = "/images/logo.png";

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

/** Absolute URL when `NEXT_PUBLIC_SITE_URL` is set; otherwise `undefined`. */
export function absoluteSiteUrl(path: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return undefined;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function restaurantJsonLd(): string {
  const url = absoluteSiteUrl("/");
  const imageAbs = absoluteSiteUrl(LOGO_PATH);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    servesCuisine: common.site.jsonLdServesCuisine,
    image: imageAbs ?? LOGO_PATH,
    areaServed: {
      "@type": "City",
      name: common.site.areaServedName,
      alternateName: common.site.areaServedAlternateName,
    },
  };
  if (url) data.url = url;
  return JSON.stringify(data);
}
