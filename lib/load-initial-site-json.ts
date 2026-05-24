import type { IncomingMessage } from "http";
import { siteJsonUpstreamRevalidateSeconds } from "@/lib/site-asset-cache";
import { fetchCommonJsonFromUpstream, fetchMenuJsonFromUpstream } from "@/lib/site-json-upstream-fetch";
import type { CommonCopy } from "@/shared/data/common";
import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";
import {
  remoteCommonFetchUrlsAbsolute,
  remoteMenuFetchUrlsAbsolute,
  STATIC_COMMON_URL,
  STATIC_MENU_URL,
} from "@/shared/data/site-json-endpoints";
import {
  isValidCommonPayload,
  isValidMenuPayload,
  type SiteMenuPayload,
} from "@/shared/data/site-json-payload";

function requestOrigin(req?: IncomingMessage): string | null {
  if (!req?.headers?.host) return null;
  const xf = req.headers["x-forwarded-proto"];
  const raw = Array.isArray(xf) ? xf[0] : xf;
  const proto = raw?.split(",")[0]?.trim() || "http";
  return `${proto}://${req.headers.host}`;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const init =
      typeof window === "undefined"
        ? ({
            cache: "default" as const,
            next: { revalidate: siteJsonUpstreamRevalidateSeconds() },
          } as RequestInit)
        : ({ cache: "default" as const } satisfies RequestInit);
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

async function loadCommonLocal(origin: string | null): Promise<CommonCopy | null> {
  const url = origin ? `${origin}${STATIC_COMMON_URL}` : STATIC_COMMON_URL;
  const json = await fetchJson(url);
  return isValidCommonPayload(json) ? json : null;
}

async function loadMenuLocal(origin: string | null): Promise<SiteMenuPayload | null> {
  const url = origin ? `${origin}${STATIC_MENU_URL}` : STATIC_MENU_URL;
  const json = await fetchJson(url);
  return isValidMenuPayload(json) ? json : null;
}

async function loadCommonRemote(origin: string | null): Promise<CommonCopy | null> {
  if (origin) {
    for (const url of remoteCommonFetchUrlsAbsolute(origin)) {
      const json = await fetchJson(url);
      if (isValidCommonPayload(json)) return json;
    }
  }
  const upstream = await fetchCommonJsonFromUpstream();
  return isValidCommonPayload(upstream) ? upstream : null;
}

async function loadMenuRemote(origin: string | null): Promise<SiteMenuPayload | null> {
  if (origin) {
    for (const url of remoteMenuFetchUrlsAbsolute(origin)) {
      const json = await fetchJson(url);
      if (isValidMenuPayload(json)) return json;
    }
  }
  const upstream = await fetchMenuJsonFromUpstream();
  return isValidMenuPayload(upstream) ? upstream : null;
}

/**
 * Loads `common.json` + `menu.json` for `_app.getInitialProps` (server + client navigations).
 * With **`NEXT_PUBLIC_ENV_MODE=dev`** (or `development`), uses `/static/*.json` only.
 * Otherwise loads API/upstream first; if that fails, falls back to `/static/*.json`.
 *
 * On **first document load**, results are embedded in `__NEXT_DATA__` (not visible as separate JSON rows in Network).
 * Use the **document** response in DevTools or page source to inspect `__initialCommon` / `__initialMenu`.
 */
export async function loadInitialSiteJson(req?: IncomingMessage): Promise<{
  common: CommonCopy | null;
  menu: SiteMenuPayload | null;
}> {
  const origin = typeof window === "undefined" ? requestOrigin(req) : window.location.origin;

  if (isLocalPublicJsonMode()) {
    const [common, menu] = await Promise.all([loadCommonLocal(origin), loadMenuLocal(origin)]);
    return { common, menu };
  }

  const [remoteCommon, remoteMenu] = await Promise.all([loadCommonRemote(origin), loadMenuRemote(origin)]);

  const [common, menu] = await Promise.all([
    remoteCommon ?? loadCommonLocal(origin),
    remoteMenu ?? loadMenuLocal(origin),
  ]);

  return { common, menu };
}
