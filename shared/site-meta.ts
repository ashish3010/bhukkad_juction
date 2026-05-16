/** Public site URL with no trailing slash — set in `.env` for correct Open Graph / Twitter cards. */
export const SITE_NAME = "The Bhukkad Junction";

export const SITE_TITLE = `${SITE_NAME} | Order food online`;

export const SITE_DESCRIPTION =
  "Order authentic Bihar-style meals, street food, and combos from The Bhukkad Junction. Fresh from our kitchen — delivery in Gurgaon (Gurugram) and nearby areas. Cash on delivery available.";

export const SITE_KEYWORDS = [
  "The Bhukkad Junction",
  "food delivery Gurugram",
  "food delivery Gurgaon",
  "Bihari food delivery Gurugram",
  "litti chokha online Gurugram",
  "Indian street food Gurgaon",
  "order food Gurugram",
  "Khane ka junction",
].join(", ");

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
    servesCuisine: ["Indian", "Bihari"],
    image: imageAbs ?? LOGO_PATH,
    areaServed: {
      "@type": "City",
      name: "Gurugram",
      alternateName: "Gurgaon",
    },
  };
  if (url) data.url = url;
  return JSON.stringify(data);
}
