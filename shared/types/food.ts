export type Product = {
  id: string;
  name: string;
  /** Menu detail line (e.g. portion note); empty if not on menu */
  subtitle: string;
  price: number;
  /** Appended to price, e.g. "/pc" for per-piece items */
  priceNote?: string;
  image: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  menuHeading: string;
  image: string;
};

export type CartLine = {
  productId: string;
  quantity: number;
};
