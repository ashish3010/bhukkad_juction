import { common } from "@/shared/data/common";

/** Public site URL with no trailing slash — set in `.env` for correct Open Graph / Twitter cards. */
export const SITE_NAME = common.site.name;

export const SITE_TITLE = common.site.title;

export const SITE_DESCRIPTION = common.site.description;

export const SITE_KEYWORDS = common.site.keywords;

export const LOGO_PATH = "/images/logo.png";

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
