/**
 * Live site used for remote JSON and (in dev) optional absolute URLs.
 * Override in `.env.local`, e.g. `NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN=https://thebhukkadjunction.com`
 */
export const PRODUCTION_SITE_ORIGIN =
  process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") || "https://thebhukkadjunction.com";
