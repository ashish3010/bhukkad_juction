import type { CartLine } from "@/shared/types/food";
import { appendPlacedOrder } from "@/features/orders/order-history-storage";
import { CHECKOUT_DELIVERY_FEE } from "@/features/checkout/pricing";
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
  /** Sum of line items before delivery. */
  subtotal: number;
  deliveryFee: number;
  /** Subtotal + deliveryFee (+ taxes when added later). */
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

export function writeOrderPlacedSnapshot(
  lines: CartLine[],
  opts?: { orderNote?: string },
): OrderPlacedSnapshot | null {
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
  const subtotal = orderLines.reduce((s, x) => s + x.lineTotal, 0);
  const deliveryFee = CHECKOUT_DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const orderId = `BJ-${randomOrderSuffix()}`;
  const addrFirst = def.address.split("\n")[0].trim();
  const deliveryTitle = addrFirst.split(",")[0]?.trim() || "Your address";
  const note = opts?.orderNote?.trim();
  const addressBlock = def.address.replace(/\n/g, ", ") + (note ? `\n\nNote: ${note}` : "");

  const snap: OrderPlacedSnapshot = {
    orderId,
    lines: orderLines,
    subtotal,
    deliveryFee,
    total,
    deliveryTitle,
    deliveryAddress: addressBlock,
    customerName: def.fullName.trim(),
    customerPhone: def.phone.trim(),
    placedAt: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(snap));

  const firstProduct = lines[0] ? getProductById(lines[0].productId) : undefined;
  appendPlacedOrder({
    orderId: snap.orderId,
    placedAt: snap.placedAt,
    total: snap.total,
    lines: lines.map((cl, i) => ({
      productId: cl.productId,
      name: orderLines[i]?.name ?? getProductById(cl.productId)?.name ?? cl.productId,
      quantity: cl.quantity,
      lineTotal: orderLines[i]?.lineTotal ?? 0,
    })),
    previewImage: firstProduct?.image ?? "",
  });

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
    const lines = o.lines as OrderPlacedLine[];
    const subtotalFromLines = lines.reduce((s, l) => s + l.lineTotal, 0);
    const subtotal = typeof o.subtotal === "number" && Number.isFinite(o.subtotal) ? o.subtotal : subtotalFromLines;
    const deliveryFee =
      typeof o.deliveryFee === "number" && Number.isFinite(o.deliveryFee) ? o.deliveryFee : Math.max(0, o.total - subtotalFromLines);
    return {
      orderId: o.orderId,
      lines,
      subtotal,
      deliveryFee,
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
