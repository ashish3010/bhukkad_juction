import { PRODUCTION_SITE_ORIGIN } from "@/shared/site-remote";

export const STATIC_COMMON_URL = "/static/common.json";
export const STATIC_MENU_URL = "/static/menu.json";

/** Same-origin proxy (see `next.config.ts` rewrites). */
const proxiedCommonUrl = "/site-copy/cdn/common.json";
const proxiedMenuUrl = "/site-copy/cdn/menu.json";

/** Client or server: same-origin API first (Bearer attached server-side). */
export function remoteCommonFetchUrls(): string[] {
  return ["/api/site-common", `${PRODUCTION_SITE_ORIGIN}/common.json`, proxiedCommonUrl];
}

export function remoteMenuFetchUrls(): string[] {
  return ["/api/site-menu", `${PRODUCTION_SITE_ORIGIN}/cdn/menu.json`, proxiedMenuUrl];
}

/** For server-side `fetch` (needs absolute URL). */
export function remoteCommonFetchUrlsAbsolute(origin: string): string[] {
  return remoteCommonFetchUrls().map((u) => (u.startsWith("/") ? `${origin}${u}` : u));
}

export function remoteMenuFetchUrlsAbsolute(origin: string): string[] {
  return remoteMenuFetchUrls().map((u) => (u.startsWith("/") ? `${origin}${u}` : u));
}
