import { IMAGE_ASSETS_ROOT } from "@/shared/image-assets-root";

/** Fixes `https:/host/...` so absolute-URL detection works. */
function normalizeHttpSchemeSlashes(input: string): string {
  const s = input.trim();
  if (/^https:\/\//i.test(s)) return s;
  if (/^https:\//i.test(s)) return `https://${s.slice("https:/".length).replace(/^\/+/, "")}`;
  if (/^http:\/\//i.test(s)) return s;
  if (/^http:\//i.test(s)) return `http://${s.slice("http:/".length).replace(/^\/+/, "")}`;
  return s;
}

function remainderAfterAssetPrefix(
  prefix: "/images/" | "/animation/",
  src: string,
): string {
  return src.slice(prefix.length).replace(/^\/+/, "");
}

function joinRemotePath(relativeAfterImages: string): string {
  const root = IMAGE_ASSETS_ROOT.replace(/\/+$/, "");
  return `${root}/images/${relativeAfterImages}`;
}

function joinRemoteAnimationPath(relativeAfterAnimation: string): string {
  const root = IMAGE_ASSETS_ROOT.replace(/\/+$/, "");
  return `${root}/animations/${relativeAfterAnimation}`;
}

/**
 * `/images/foo.png` → **`{IMAGE_ASSETS_ROOT}/images/foo.png`** (fixed in `image-assets-root.ts`).
 * Already-absolute `http(s)://…` URLs are returned unchanged.
 */
export function resolveImageSrc(src: string): string {
  if (!src) return src;
  const srcNorm = normalizeHttpSchemeSlashes(src);
  if (/^https?:\/\//i.test(srcNorm)) return srcNorm;

  if (src.startsWith("/images/")) {
    const rest = normalizeHttpSchemeSlashes(remainderAfterAssetPrefix("/images/", src));
    if (/^https?:\/\//i.test(rest)) return resolveImageSrc(rest);
    return joinRemotePath(rest);
  }
  return src;
}

/**
 * `/animation/foo.lottie` → **`{IMAGE_ASSETS_ROOT}/animations/foo.lottie`**.
 */
export function resolveAnimationSrc(src: string): string {
  if (!src) return src;
  const srcNorm = normalizeHttpSchemeSlashes(src);
  if (/^https?:\/\//i.test(srcNorm)) return srcNorm;

  if (src.startsWith("/animation/")) {
    const rest = normalizeHttpSchemeSlashes(remainderAfterAssetPrefix("/animation/", src));
    if (/^https?:\/\//i.test(rest)) return resolveAnimationSrc(rest);
    return joinRemoteAnimationPath(rest);
  }
  return src;
}
