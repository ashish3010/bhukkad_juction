/**
 * Vercel Blob public origin (no trailing slash). Must match **`next.config`** `rewrites` for `/cdn/:path*`.
 */
export const VERCEL_BLOB_PUBLIC_ORIGIN =
  "https://hmwj9hql4qgiypy7.public.blob.vercel-storage.com";

/**
 * Same-origin base for menu/UI images — resolved as **`/cdn/assets/images/…`** → rewrite to
 * **`{VERCEL_BLOB_PUBLIC_ORIGIN}/assets/images/…`** (same `/cdn/` pattern as other blob assets).
 */
export const IMAGE_ASSETS_ROOT = "/cdn/assets";
