/**
 * HTTP / Next `fetch` caching for site JSON, `next/image`, and related assets.
 *
 * Env (all optional, sensible defaults):
 * - `SITE_JSON_S_MAXAGE` — `s-maxage` for `/api/site-common` & `/api/site-menu` (seconds, default 300).
 * - `SITE_JSON_STALE_WHILE_REVALIDATE` — `stale-while-revalidate` for those APIs (default 3600).
 * - `SITE_JSON_MAX_AGE` — browser `max-age` for those APIs (default 60).
 * - `SITE_JSON_UPSTREAM_REVALIDATE_SECONDS` — Next Data Cache `fetch(..., { next: { revalidate } })` for upstream JSON (default 300, min 30).
 * - `NEXT_IMAGE_MINIMUM_CACHE_TTL` — `images.minimumCacheTTL` in seconds (default 86400).
 *
 * **Animations** (`.lottie` on your CDN): this app does not proxy them; set long `Cache-Control` on the
 * origin for `{assetsRoot}/animations/*.lottie` so the browser caches fetches from DotLottie.
 */

export function siteJsonApiCacheControl(): string {
  const sMax = clampInt(process.env.SITE_JSON_S_MAXAGE, 300, 30, 86_400);
  const swr = clampInt(process.env.SITE_JSON_STALE_WHILE_REVALIDATE, 3600, sMax, 7 * 86_400);
  const maxAge = clampInt(process.env.SITE_JSON_MAX_AGE, 60, 0, sMax);
  return `public, s-maxage=${sMax}, stale-while-revalidate=${swr}, max-age=${maxAge}`;
}

export function siteJsonUpstreamRevalidateSeconds(): number {
  return clampInt(process.env.SITE_JSON_UPSTREAM_REVALIDATE_SECONDS, 300, 30, 86_400);
}

export function nextImageMinimumCacheTtlSeconds(): number {
  return clampInt(process.env.NEXT_IMAGE_MINIMUM_CACHE_TTL, 86_400, 60, 31_536_000);
}

/** Cache-Control for immutable-ish static JSON under `/static/*.json`. */
export function staticSiteJsonCacheControl(): string {
  return "public, max-age=300, stale-while-revalidate=86400";
}

function clampInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = raw != null && raw !== "" ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export type SiteJsonUpstreamFetchInit = RequestInit & { next?: { revalidate: number } };

export function siteJsonUpstreamFetchInit(headers: Record<string, string>): SiteJsonUpstreamFetchInit {
  return {
    headers,
    cache: "default",
    next: { revalidate: siteJsonUpstreamRevalidateSeconds() },
  };
}
