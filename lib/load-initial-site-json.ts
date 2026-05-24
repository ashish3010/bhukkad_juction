import type { IncomingMessage } from "http";
import { fetchCommonJsonFromUpstream, fetchMenuJsonFromUpstream } from "@/lib/site-json-upstream-fetch";
import type { CommonCopy } from "@/shared/data/common";
import { isLocalPublicJsonMode, isLocalPublicJsonModeOnServer } from "@/shared/data/local-json-mode";
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
    const res = await fetch(url, { cache: "no-store" });
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
  if (isValidCommonPayload(upstream)) return upstream;
  if (origin) {
    const fallback = await fetchJson(`${origin}${STATIC_COMMON_URL}`);
    return isValidCommonPayload(fallback) ? fallback : null;
  }
  return null;
}

async function loadMenuRemote(origin: string | null): Promise<SiteMenuPayload | null> {
  if (origin) {
    for (const url of remoteMenuFetchUrlsAbsolute(origin)) {
      const json = await fetchJson(url);
      if (isValidMenuPayload(json)) return json;
    }
  }
  const upstream = await fetchMenuJsonFromUpstream();
  if (isValidMenuPayload(upstream)) return upstream;
  if (origin) {
    const fallback = await fetchJson(`${origin}${STATIC_MENU_URL}`);
    return isValidMenuPayload(fallback) ? fallback : null;
  }
  return null;
}

/**
 * Loads `common.json` + `menu.json` for `_app.getInitialProps` (server + client navigations).
 * Uses the same rules as the client providers: local public mode → `/static/*.json`, else API / upstream / static fallback.
 */
export async function loadInitialSiteJson(req?: IncomingMessage): Promise<{
  common: CommonCopy | null;
  menu: SiteMenuPayload | null;
}> {
  const isServer = typeof window === "undefined";
  const hostHeader = req?.headers?.host;
  const local = isServer ? isLocalPublicJsonModeOnServer(hostHeader) : isLocalPublicJsonMode();
  const origin = isServer ? requestOrigin(req) : window.location.origin;

  if (local) {
    const [common, menu] = await Promise.all([loadCommonLocal(origin), loadMenuLocal(origin)]);
    return { common, menu };
  }

  const [common, menu] = await Promise.all([loadCommonRemote(origin), loadMenuRemote(origin)]);
  return { common, menu };
}
