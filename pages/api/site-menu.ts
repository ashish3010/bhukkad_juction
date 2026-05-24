import type { NextApiRequest, NextApiResponse } from "next";
import { fetchMenuJsonFromUpstream } from "@/lib/site-json-upstream-fetch";

/**
 * Proxies live menu JSON from production. Uses `MENU_JSON_SERVER_REFRESH_TOKEN` on the
 * upstream request (server-only; never exposed to the browser).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  try {
    const data = await fetchMenuJsonFromUpstream();
    if (data == null) {
      return res.status(404).json({ error: "menu_not_found" });
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "HEAD") {
      return res.status(200).end();
    }
    return res.status(200).send(JSON.stringify(data));
  } catch {
    return res.status(502).json({ error: "upstream_fetch_failed" });
  }
}
