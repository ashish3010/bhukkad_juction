import { create } from "zustand";
import type { Category, Product } from "@/shared/types/food";

/** Bundled fallback: `public/static/menu.json` (also at `/static/menu.json`). Runtime menu may load from production + this. */
import menuData from "../../public/static/menu.json";

type MenuJson = {
  categories: Category[];
  products: Product[];
};

const menuLocal = menuData as MenuJson;

type MenuState = {
  categories: Category[];
  products: Product[];
};

export const useMenuStore = create<MenuState>(() => ({
  categories: menuLocal.categories,
  products: menuLocal.products,
}));

export function formatProductPrice(product: Pick<Product, "price" | "priceNote">): string {
  return `₹${product.price}${product.priceNote ?? ""}`;
}

export function getProductById(id: string): Product | undefined {
  return useMenuStore.getState().products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return useMenuStore.getState().products.filter((p) => p.categoryId === categoryId);
}
