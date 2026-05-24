import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";

export function getImageAssetsBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_IMAGE_ASSETS_BASE?.trim() ||
    process.env.NEXT_PUBLIC_ASSETS_IMAGES_BASE?.trim() ||
    "";
  let root = raw.replace(/\/+$/, "");
  if (/\/images$/i.test(root)) {
    root = root.slice(0, -"/images".length).replace(/\/+$/, "");
  }
  if (/\/animations$/i.test(root)) {
    root = root.slice(0, -"/animations".length).replace(/\/+$/, "");
  }
  return root;
}

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

/** Some CMS payloads wrongly store `/images/https://host/...` instead of a path or bare URL. */
function remainderAfterAssetPrefix(
  prefix: "/images/" | "/animation/",
  src: string,
): string {
  return src.slice(prefix.length).replace(/^\/+/, "");
}

function joinRemotePath(relativeAfterImages: string): string {
  const root = getImageAssetsBaseUrl();
  if (!root) {
    return `/images/${relativeAfterImages}`;
  }
  const suf = imageAssetsSuffix();
  const underImages = `${root}/images/${relativeAfterImages}`;
  if (!suf) return underImages;
  if (isQueryStyleSuffix(suf)) {
    return appendQueryString(underImages, suf);
  }
  const seg = suf.replace(/^\/+|\/+$/g, "");
  return `${root}/${seg}/images/${relativeAfterImages}`;
}

function joinRemoteAnimationPath(relativeAfterAnimation: string): string {
  const root = getImageAssetsBaseUrl();
  if (!root) {
    return `/animation/${relativeAfterAnimation}`;
  }
  const suf = imageAssetsSuffix();
  const underAnimations = `${root}/animations/${relativeAfterAnimation}`;
  if (!suf) return underAnimations;
  if (isQueryStyleSuffix(suf)) {
    return appendQueryString(underAnimations, suf);
  }
  const seg = suf.replace(/^\/+|\/+$/g, "");
  return `${root}/${seg}/animations/${relativeAfterAnimation}`;
}

export type ResolveImageSrcOptions = {
  /** When true, map `/images/...` to the live assets host even in local public mode (OG, JSON-LD). */
  preferRemoteAssets?: boolean;
};

/**
 * Maps `/images/foo.png` → `{root}/images/foo.png` (see `getImageAssetsBaseUrl`), with optional suffix envs.
 * If the assets root env is unset, `/images/…` stays on the app origin (except query suffix in local mode).
 * Absolute `http(s)` URLs only get a **query-style** suffix when configured.
 */
export function resolveImageSrc(
  src: string,
  opts?: ResolveImageSrcOptions,
): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) {
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  const local = isLocalPublicJsonMode() && !opts?.preferRemoteAssets;
  if (local) {
    if (!src.startsWith("/images/")) return src;
    const rest = remainderAfterAssetPrefix("/images/", src);
    if (/^https?:\/\//i.test(rest)) {
      return resolveImageSrc(rest, opts);
    }
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  if (src.startsWith("/images/")) {
    const rest = remainderAfterAssetPrefix("/images/", src);
    if (/^https?:\/\//i.test(rest)) {
      return resolveImageSrc(rest, opts);
    }
    return joinRemotePath(rest);
  }
  return src;
}

/**
 * Maps `/animation/foo.lottie` → `{root}/animations/foo.lottie` (same assets root as images).
 * Browser caching follows your CDN / origin `Cache-Control` on that URL — set long `max-age` on `.lottie` at the host.
 */
export function resolveAnimationSrc(
  src: string,
  opts?: ResolveImageSrcOptions,
): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) {
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  const local = isLocalPublicJsonMode() && !opts?.preferRemoteAssets;
  if (local) {
    if (!src.startsWith("/animation/")) return src;
    const rest = remainderAfterAssetPrefix("/animation/", src);
    if (/^https?:\/\//i.test(rest)) {
      return resolveAnimationSrc(rest, opts);
    }
    const suf = imageAssetsSuffix();
    if (!suf || !isQueryStyleSuffix(suf)) return src;
    return appendQueryString(src, suf);
  }
  if (src.startsWith("/animation/")) {
    const rest = remainderAfterAssetPrefix("/animation/", src);
    if (/^https?:\/\//i.test(rest)) {
      return resolveAnimationSrc(rest, opts);
    }
    return joinRemoteAnimationPath(rest);
  }
  return src;
}
