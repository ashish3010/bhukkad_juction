import type { Category, Product } from "@/shared/types/food";

/** Shared assets in /public/images */
const littiPlate = "/images/litti_chokha.png";
const plainFries = "/images/plain_fries.png";
const periPeriFries = "/images/peri-peri_fries.png";
const cheeseFries = "/images/cheese_fries.png";
const plainMaggi = "/images/plain_maggi_clean.png";
const vegMaggi = "/images/veg_maggi_clean.png";
const cheeseVegMaggi = "/images/cheese_veg_maggi_clean.png";
const aalooParatha = "/images/aaloo_paratha.png";
const sattuParatha = "/images/sattu_paratha.jpg";
const paneerParatha = "/images/paneer_paratha.png";
const paneerBhurjiMeal = "/images/paneer_bhurji_meal.png";
const eggBhurjiMeal = "/images/egg_bhurji_meal.png";
const eggCurryMeal = "/images/egg_curry_meal.png";
const paneerMasalaMeal = "/images/paneer_masala_meal.png";
const kheer = "/images/kheer.png";
const thekua = "/images/thekua.png";

export const CATEGORIES: Category[] = [
  {
    id: "authentic-litti",
    name: "Litti",
    menuHeading: "Authentic Litti Chokha (Bhukkad's Special)",
    image: littiPlate,
  },
  {
    id: "quick-bites",
    name: "Quick Bites",
    menuHeading: "Quick Bites",
    image: plainFries,
  },
  {
    id: "paratha-specials",
    name: "Paratha",
    menuHeading: "Paratha Specials",
    image: aalooParatha,
  },
  {
    id: "bhukkad-meals",
    name: "Meals",
    menuHeading: "Bhukkad Meals (Chef's Special)",
    image: paneerMasalaMeal,
  },
  {
    id: "desserts-specials",
    name: "Desserts",
    menuHeading: "Desserts & Specials",
    image: kheer,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "ghee-litti-chokha",
    name: "2pcs Ghee Litti Chokha, Chutney, Thecha",
    subtitle: "",
    price: 89,
    image: littiPlate,
    categoryId: "authentic-litti",
  },
  {
    id: "fried-litti-chokha",
    name: "2pcs Fried Litti Chokha, Chutney, Thecha",
    subtitle: "",
    price: 79,
    image: littiPlate,
    categoryId: "authentic-litti",
  },
  {
    id: "cheesy-litti-bomb",
    name: "2pcs Bhukkad Cheesy Litti Bomb",
    subtitle: "",
    price: 119,
    image: littiPlate,
    categoryId: "authentic-litti",
  },
  {
    id: "classic-salted-fries",
    name: "Classic Salted Plain Fries",
    subtitle: "",
    price: 69,
    image: plainFries,
    categoryId: "quick-bites",
  },
  {
    id: "peri-peri-fries",
    name: "Spicy Crispy Peri Peri Fries",
    subtitle: "",
    price: 89,
    image: periPeriFries,
    categoryId: "quick-bites",
  },
  {
    id: "loaded-cheesy-fries",
    name: "Loaded Cheesy Fries",
    subtitle: "",
    price: 109,
    image: cheeseFries,
    categoryId: "quick-bites",
  },
  {
    id: "classic-plain-maggi",
    name: "Classic Plain Maggi",
    subtitle: "",
    price: 59,
    image: plainMaggi,
    categoryId: "quick-bites",
  },
  {
    id: "veg-maggi",
    name: "Veg Maggi",
    subtitle: "",
    price: 79,
    image: vegMaggi,
    categoryId: "quick-bites",
  },
  {
    id: "cheese-veg-maggi",
    name: "Cheese Veg Maggi",
    subtitle: "",
    price: 99,
    image: cheeseVegMaggi,
    categoryId: "quick-bites",
  },
  {
    id: "aalu-paratha-2",
    name: "2pcs Aalu Paratha",
    subtitle: "",
    price: 79,
    image: aalooParatha,
    categoryId: "paratha-specials",
  },
  {
    id: "sattu-paratha-2",
    name: "2pcs Sattu Paratha",
    subtitle: "",
    price: 89,
    image: sattuParatha,
    categoryId: "paratha-specials",
  },
  {
    id: "paneer-paratha-2",
    name: "2pcs Paneer Paratha",
    subtitle: "",
    price: 119,
    image: paneerParatha,
    categoryId: "paratha-specials",
  },
  {
    id: "paneer-bhurji-meal",
    name: "Paneer Bhurji Meal",
    subtitle: "4 Roti & Salad",
    price: 149,
    image: paneerBhurjiMeal,
    categoryId: "bhukkad-meals",
  },
  {
    id: "egg-bhurji-meal",
    name: "Egg Bhurji Meal",
    subtitle: "4 Roti & Salad",
    price: 119,
    image: eggBhurjiMeal,
    categoryId: "bhukkad-meals",
  },
  {
    id: "egg-curry-meal",
    name: "Egg Curry Meal",
    subtitle: "4 Roti, Rice & Salad",
    price: 149,
    image: eggCurryMeal,
    categoryId: "bhukkad-meals",
  },
  {
    id: "paneer-masala-meal",
    name: "Paneer Masala Meal",
    subtitle: "4 Roti, Creamy Masala Gravy & Salad",
    price: 179,
    image: paneerMasalaMeal,
    categoryId: "bhukkad-meals",
  },
  {
    id: "kheer-custard",
    name: "Homemade Kheer / Custard",
    subtitle: "",
    price: 49,
    image: kheer,
    categoryId: "desserts-specials",
  },
  {
    id: "bihari-thekua",
    name: "Bihari Thekua",
    subtitle: "",
    price: 10,
    priceNote: "/pc",
    image: thekua,
    categoryId: "desserts-specials",
  },
];

export function formatProductPrice(product: Pick<Product, "price" | "priceNote">): string {
  return `₹${product.price}${product.priceNote ?? ""}`;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}