"use client";

import { SpeedInsights, computeRoute } from "@vercel/speed-insights/react";
import { useRouter } from "next/router";

/**
 * Speed Insights for the Pages Router. `@vercel/speed-insights/next` relies on
 * `next/navigation` and only works inside `app/` layouts; this mirrors its route reporting.
 */
export function VercelSpeedInsights() {
  const router = useRouter();
  const pathParams = Object.fromEntries(
    Object.entries(router.query).filter(([, v]) => v !== undefined) as [string, string | string[]][],
  );
  const route = router.isReady
    ? (computeRoute(router.pathname, pathParams) ?? router.pathname)
    : null;

  return <SpeedInsights framework="next" route={route} />;
}
