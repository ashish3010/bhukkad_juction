/** Production origin for server-side JSON proxy routes (API). */
export function productionSiteOrigin(): string {
  return (
    process.env.PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN?.replace(/\/$/, "") ||
    "https://thebhukkadjunction.com"
  );
}
