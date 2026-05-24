import { productionSiteOrigin } from "@/lib/site-json-upstream";

async function fetchJsonFromUrls(urls: string[], bearer?: string): Promise<unknown | null> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) continue;
      return (await res.json()) as unknown;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function fetchCommonJsonFromUpstream(): Promise<unknown | null> {
  const origin = productionSiteOrigin();
  const urls = [`${origin}/common.json`, `${origin}/cdn/common.json`];
  return fetchJsonFromUrls(urls, process.env.JSON_SERVER_REFRESH_TOKEN);
}

export async function fetchMenuJsonFromUpstream(): Promise<unknown | null> {
  const origin = productionSiteOrigin();
  const urls = [`${origin}/cdn/menu.json`, `${origin}/menu.json`];
  return fetchJsonFromUrls(urls, process.env.MENU_JSON_SERVER_REFRESH_TOKEN);
}
