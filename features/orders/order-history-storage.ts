const ORDERS_STORAGE_KEY = "bj:orders";
const MAX_STORED_ORDERS = 20;

export type StoredOrderLine = {
  productId: string;
  name: string;
  quantity: number;
  lineTotal: number;
};

export type StoredOrder = {
  orderId: string;
  placedAt: number;
  total: number;
  lines: StoredOrderLine[];
  /** First line item image for list thumbnails */
  previewImage: string;
};

function isStoredOrderLine(x: unknown): x is StoredOrderLine {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.productId === "string" &&
    typeof o.name === "string" &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    typeof o.lineTotal === "number" &&
    Number.isFinite(o.lineTotal)
  );
}

function isStoredOrder(x: unknown): x is StoredOrder {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.orderId !== "string" || typeof o.placedAt !== "number" || typeof o.total !== "number") return false;
  if (typeof o.previewImage !== "string") return false;
  if (!Array.isArray(o.lines) || o.lines.length === 0) return false;
  return o.lines.every(isStoredOrderLine);
}

export function readOrderHistory(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    const parsed = data.filter(isStoredOrder);
    return parsed.sort((a, b) => b.placedAt - a.placedAt);
  } catch {
    return [];
  }
}

export type AppendPlacedOrderPayload = {
  orderId: string;
  placedAt: number;
  total: number;
  lines: StoredOrderLine[];
  previewImage: string;
};

export function appendPlacedOrder(payload: AppendPlacedOrderPayload): void {
  if (typeof window === "undefined" || payload.lines.length === 0) return;
  try {
    const prev = readOrderHistory();
    const entry: StoredOrder = {
      orderId: payload.orderId,
      placedAt: payload.placedAt,
      total: payload.total,
      lines: payload.lines,
      previewImage: payload.previewImage,
    };
    const deduped = prev.filter((o) => o.orderId !== entry.orderId);
    const next = [entry, ...deduped].slice(0, MAX_STORED_ORDERS);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}
