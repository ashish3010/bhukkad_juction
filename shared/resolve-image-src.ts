import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";
import { PRODUCTION_SITE_ORIGIN } from "@/shared/site-remote";

/**
 * Assets root (no trailing slash): `{origin}/assets`, e.g. `https://thebhukkadjunction.com/assets`.
 * Override with `NEXT_PUBLIC_IMAGE_ASSETS_BASE` or `NEXT_PUBLIC_ASSETS_IMAGES_BASE`.
 * If unset, defaults to `{NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN}/assets` (see `site-remote.ts`).
 *
 * **Local `public/images` in dev:** set `NEXT_PUBLIC_USE_LOCAL_PUBLIC_IMAGES=1` so `/images/…`
 * stays on the app origin when local public JSON mode is active (`next dev`, localhost, etc.).
 */
export function getImageAssetsBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_IMAGE_ASSETS_BASE?.trim() ||
    process.env.NEXT_PUBLIC_ASSETS_IMAGES_BASE?.trim() ||
    `${PRODUCTION_SITE_ORIGIN}/assets`;
  let root = raw.replace(/\/+$/, "");
  if (/\/images$/i.test(root)) {
    root = root.slice(0, -"/images".length).replace(/\/+$/, "");
  }
  if (/\/animations$/i.test(root)) {
    root = root.slice(0, -"/animations".length).replace(/\/+$/, "");
  }
  return root;
}

function localPublicImageFilesEnabled(): boolean {
  return (
    isLocalPublicJsonMode() && process.env.NEXT_PUBLIC_USE_LOCAL_PUBLIC_IMAGES === "1"
  );
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
 * Maps `/images/foo.png` → `{assetsRoot}/images/foo.png` (default host `thebhukkadjunction.com/assets`).
 * In local public mode, use `NEXT_PUBLIC_USE_LOCAL_PUBLIC_IMAGES=1` to keep `/images/…` on this app (e.g. `public/images`).
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
  const localUi =
    localPublicImageFilesEnabled() && !opts?.preferRemoteAssets;
  if (localUi) {
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
 * Maps `/animation/foo.lottie` → `{assetsRoot}/animations/...`. Same local override as images.
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
  const localUi =
    localPublicImageFilesEnabled() && !opts?.preferRemoteAssets;
  if (localUi) {
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
