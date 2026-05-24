/**
 * When true, menu/common loaders only refresh from `public/static/*.json` (no remote or API fetch).
 *
 * - `next dev` (`NODE_ENV === "development"`), or
 * - App opened at `localhost` / `127.0.0.1` / `[::1]` (e.g. local `next start`), or
 * - `NEXT_PUBLIC_USE_PUBLIC_JSON=1` to force this on any host.
 */
export function isLocalPublicJsonMode(): boolean {
  if (process.env.NEXT_PUBLIC_USE_PUBLIC_JSON === "1") return true;
  if (process.env.NODE_ENV === "development") return true;
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return true;
  }
  return false;
}

/** Same rules as `isLocalPublicJsonMode` for SSR / `getInitialProps` (no `window`). */
export function isLocalPublicJsonModeOnServer(hostHeader?: string): boolean {
  if (process.env.NEXT_PUBLIC_USE_PUBLIC_JSON === "1") return true;
  if (process.env.NODE_ENV === "development") return true;
  if (!hostHeader) return false;
  const h = hostHeader.split(":")[0] ?? "";
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}
