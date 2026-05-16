import type { Category, Product } from "@/shared/types/food";
import menuData from "./menu.json";

type MenuJson = {
  categories: Category[];
  products: Product[];
};

const { categories, products } = menuData as MenuJson;

export const CATEGORIES: Category[] = categories;
export const PRODUCTS: Product[] = products;

export function formatProductPrice(product: Pick<Product, "price" | "priceNote">): string {
  return `₹${product.price}${product.priceNote ?? ""}`;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}
