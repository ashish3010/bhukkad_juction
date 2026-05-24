import type { CommonCopy } from "@/shared/data/common";
import type { Category, Product } from "@/shared/types/food";

export type SiteMenuPayload = { categories: Category[]; products: Product[] };

export function isValidCommonPayload(x: unknown): x is CommonCopy {
  if (!x || typeof x !== "object") return false;
  const site = (x as { site?: unknown }).site;
  return typeof site === "object" && site !== null && typeof (site as { name?: unknown }).name === "string";
}

export function isValidMenuPayload(x: unknown): x is SiteMenuPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as { categories?: unknown; products?: unknown };
  if (!Array.isArray(o.categories) || !Array.isArray(o.products)) return false;
  if (o.categories.length === 0 || o.products.length === 0) return false;
  const c0 = o.categories[0];
  if (!c0 || typeof c0 !== "object" || typeof (c0 as { id?: unknown }).id !== "string") return false;
  const p0 = o.products[0];
  if (!p0 || typeof p0 !== "object") return false;
  const p = p0 as { id?: unknown; categoryId?: unknown; price?: unknown };
  return typeof p.id === "string" && typeof p.categoryId === "string" && typeof p.price === "number";
}
