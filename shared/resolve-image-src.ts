import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";
import { PRODUCTION_SITE_ORIGIN } from "@/shared/site-remote";

/**
 * Live image host for paths in JSON like `/images/foo.png`.
 * Override with `NEXT_PUBLIC_ASSETS_IMAGES_BASE` (no trailing slash).
 */
export const ASSETS_IMAGES_BASE_URL =
  process.env.NEXT_PUBLIC_ASSETS_IMAGES_BASE?.replace(/\/$/, "") ||
  `${PRODUCTION_SITE_ORIGIN}/assets/images`;

/**
 * DotLottie / animation files: `/animation/…` maps here when not in local public mode.
 * Default (no `NEXT_PUBLIC_ASSETS_ANIMATIONS_BASE`): with a **path** `IMAGE_ASSETS_SUFFIX` `v2`, URLs are
 * `{origin}/assets/v2/animations/{file}` (i.e. `{suffix}/animations/…` under `/assets/`).
 * With `NEXT_PUBLIC_ASSETS_ANIMATIONS_BASE` set, suffix is inserted like images: `{base}/{suffix}/{file}`.
 */
export const ASSETS_ANIMATIONS_BASE_URL =
  process.env.NEXT_PUBLIC_ASSETS_ANIMATIONS_BASE?.replace(/\/$/, "") ||
  `${PRODUCTION_SITE_ORIGIN}/assets/animations`;

/**
 * Optional suffix for resolved image and animation URLs (`resolveImageSrc`, `resolveAnimationSrc`).
 * Set `NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX` so it applies in the browser; `IMAGE_ASSETS_SUFFIX` is read on the server only.
 *
 * **Images** (`/images/…`):
 * - **Path segment** (default): e.g. `v2` → `…/assets/images/v2/foo.png`
 * - **Query string**: starts with `?` / `&`, or looks like `key=value` with no `/` → `…/assets/images/foo.png?v=1`
 *
 * **Animations** (`/animation/…`):
 * - **Path segment**: `v2` → `…/assets/v2/animations/foo.lottie` (i.e. `{suffix}/animations/…` under `/assets/`)
 * - **Query string**: `…/assets/animations/foo.lottie?v=1`
 */
export function imageAssetsSuffix(): string {
  return (
    process.env.NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX?.trim() ||
    process.env.IMAGE_ASSETS_SUFFIX?.trim() ||
    ""
  );
}

function isQueryStyleSuffix(s: string): boolean {
  if (!s) return false;
  if (s.startsWith("?") || s.startsWith("&")) return true;
  if (s.includes("/")) return false;
  return s.includes("=");
}

function appendQueryString(url: string, suffix: string): string {
  const body = suffix.replace(/^\?+/, "").replace(/^&+/, "");
  if (!body) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${body}`;
}

function joinRemotePath(relativeAfterImages: string): string {
  const suf = imageAssetsSuffix();
  const baseFile = `${ASSETS_IMAGES_BASE_URL}/${relativeAfterImages}`;
  if (!suf) return baseFile;
  if (isQueryStyleSuffix(suf)) {
    return appendQueryString(baseFile, suf);
  }
  const seg = suf.replace(/^\/+|\/+$/g, "");
  return `${ASSETS_IMAGES_BASE_URL}/${seg}/${relativeAfterImages}`;
}

/** `/animation/foo.lottie` → default host `…/assets/{suffix}/animations/foo` or custom base `…/{suffix}/foo`. */
function joinRemoteAnimationPath(relativeAfterAnimation: string): string {
  const suf = imageAssetsSuffix();
  const hasCustomAnimationsBase = Boolean(process.env.NEXT_PUBLIC_ASSETS_ANIMATIONS_BASE?.trim());
  const noSuffixFile = `${ASSETS_ANIMATIONS_BASE_URL}/${relativeAfterAnimation}`;
  if (!suf) return noSuffixFile;
  if (isQueryStyleSuffix(suf)) {
    return appendQueryString(noSuffixFile, suf);
  }
  const seg = suf.replace(/^\/+|\/+$/g, "");
  if (hasCustomAnimationsBase) {
    return `${ASSETS_ANIMATIONS_BASE_URL}/${seg}/${relativeAfterAnimation}`;
  }
  return `${PRODUCTION_SITE_ORIGIN}/assets/${seg}/animations/${relativeAfterAnimation}`;
}

export type ResolveImageSrcOptions = {
  /** When true, map `/images/...` to the live assets host even in local public mode (OG, JSON-LD). */
  preferRemoteAssets?: boolean;
};

/**
 * Maps `/images/foo.png` → CDN URL under `ASSETS_IMAGES_BASE_URL`, with optional `IMAGE_ASSETS_SUFFIX`.
 * In local public JSON mode, relative `/images/...` URLs are unchanged except a **query-style** suffix is appended.
 * Absolute `http(s)` URLs only get a **query-style** suffix when configured.
 */
export function resolveImageSrc(src: string, opts?: ResolveImageSrcOptions): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) {
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  const local = isLocalPublicJsonMode() && !opts?.preferRemoteAssets;
  if (local) {
    if (!src.startsWith("/images/")) return src;
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  if (src.startsWith("/images/")) {
    return joinRemotePath(src.slice("/images/".length));
  }
  return src;
}

/**
 * Maps `/animation/foo.lottie` to the live site using the same `IMAGE_ASSETS_SUFFIX` rules as images.
 * Path segment `v2` → `{origin}/assets/v2/animations/foo.lottie`. Query-style suffix appends to `…/assets/animations/foo.lottie`.
 */
export function resolveAnimationSrc(src: string, opts?: ResolveImageSrcOptions): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) {
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  const local = isLocalPublicJsonMode() && !opts?.preferRemoteAssets;
  if (local) {
    if (!src.startsWith("/animation/")) return src;
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  if (src.startsWith("/animation/")) {
    return joinRemoteAnimationPath(src.slice("/animation/".length));
  }
  return src;
}
