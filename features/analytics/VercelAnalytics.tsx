"use client";

import { computeRoute } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";

/**
 * Web Analytics for the Pages Router. `@vercel/analytics/next` uses `next/navigation`
 * and only works inside `app/` layouts; this mirrors its route + path reporting.
 */
export function VercelAnalytics() {
  const router = useRouter();
  const pathParams = Object.fromEntries(
    Object.entries(router.query).filter(([, v]) => v !== undefined) as [string, string | string[]][],
  );
  const path = router.pathname || null;
  const route = router.isReady
    ? (computeRoute(router.pathname, pathParams) ?? router.pathname)
    : null;

  return (
    <Analytics
      framework="next"
      path={path}
      route={route}
      basePath={process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH}
      configString={process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG}
    />
  );
}
