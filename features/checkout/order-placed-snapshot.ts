import type { CartLine } from "@/shared/types/food";
import { getProductById } from "@/shared/data/menu";
import { loadAddressBook } from "@/features/checkout/delivery-address-storage";

const SESSION_KEY = "bj:last-order-placed";

export type OrderPlacedLine = {
  name: string;
  quantity: number;
  lineTotal: number;
};

export type OrderPlacedSnapshot = {
  orderId: string;
  lines: OrderPlacedLine[];
  total: number;
  deliveryTitle: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  placedAt: number;
};

function randomOrderSuffix(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function writeOrderPlacedSnapshot(lines: CartLine[]): OrderPlacedSnapshot | null {
  if (typeof window === "undefined" || lines.length === 0) return null;
  const book = loadAddressBook();
  const def = book.find((e) => e.isDefault) ?? book[0];
  if (!def) return null;

  const orderLines: OrderPlacedLine[] = lines.map((l) => {
    const p = getProductById(l.productId);
    const price = p?.price ?? 0;
    return {
      name: p?.name ?? l.productId,
      quantity: l.quantity,
      lineTotal: price * l.quantity,
    };
  });
  const total = orderLines.reduce((s, x) => s + x.lineTotal, 0);
  const orderId = `BJ-${randomOrderSuffix()}`;
  const addrFirst = def.address.split("\n")[0].trim();
  const deliveryTitle = addrFirst.split(",")[0]?.trim() || "Your address";

  const snap: OrderPlacedSnapshot = {
    orderId,
    lines: orderLines,
    total,
    deliveryTitle,
    deliveryAddress: def.address.replace(/\n/g, ", "),
    customerName: def.fullName.trim(),
    customerPhone: def.phone.trim(),
    placedAt: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(snap));
  return snap;
}

export function readOrderPlacedSnapshot(): OrderPlacedSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const o = data as Record<string, unknown>;
    if (typeof o.orderId !== "string" || !Array.isArray(o.lines) || typeof o.total !== "number") return null;
    return {
      orderId: o.orderId,
      lines: o.lines as OrderPlacedLine[],
      total: o.total,
      deliveryTitle: String(o.deliveryTitle ?? ""),
      deliveryAddress: String(o.deliveryAddress ?? ""),
      customerName: typeof o.customerName === "string" ? o.customerName : "",
      customerPhone: typeof o.customerPhone === "string" ? o.customerPhone : "",
      placedAt: typeof o.placedAt === "number" ? o.placedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function clearOrderPlacedSnapshot(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
