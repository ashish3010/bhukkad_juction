import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CartLine } from "@/shared/types/food";

/** Session key for cart lines (tab-scoped; cleared when the tab closes). */
export const CART_SESSION_STORAGE_KEY = "bj:cart";

type CartStore = {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  setLineQuantity: (productId: string, quantity: number) => void;
  setLines: (lines: CartLine[]) => void;
  clear: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function parseCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const out: CartLine[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const productId = rec.productId;
    const quantity = rec.quantity;
    if (typeof productId !== "string" || productId.length === 0) continue;
    const q =
      typeof quantity === "number"
        ? quantity
        : Number.parseInt(String(quantity), 10);
    if (!Number.isFinite(q)) continue;
    const n = Math.floor(q);
    if (n <= 0) continue;
    out.push({ productId, quantity: n });
  }
  return out;
}

const sessionStorageAdapter = createJSONStorage<{ lines: CartLine[] }>(() =>
  typeof window === "undefined" ? noopStorage : sessionStorage,
);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (productId, quantity = 1) => {
        const { lines } = get();
        const idx = lines.findIndex((l) => l.productId === productId);
        if (idx === -1) {
          set({ lines: [...lines, { productId, quantity }] });
          return;
        }
        const next = [...lines];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        set({ lines: next });
      },

      setLineQuantity: (productId, quantity) => {
        const q = Math.max(0, Math.floor(quantity));
        const { lines } = get();
        if (q === 0) {
          set({ lines: lines.filter((l) => l.productId !== productId) });
          return;
        }
        const idx = lines.findIndex((l) => l.productId === productId);
        if (idx === -1) {
          set({ lines: [...lines, { productId, quantity: q }] });
          return;
        }
        const next = [...lines];
        next[idx] = { productId, quantity: q };
        set({ lines: next });
      },

      setLines: (lines) => set({ lines }),

      clear: () => set({ lines: [] }),
    }),
    {
      name: CART_SESSION_STORAGE_KEY,
      storage: sessionStorageAdapter,
      partialize: (s) => ({ lines: s.lines }),
      merge: (persistedState, currentState) => {
        const lines =
          persistedState &&
          typeof persistedState === "object" &&
          "lines" in persistedState
            ? parseCartLines((persistedState as { lines: unknown }).lines)
            : currentState.lines;
        return { ...currentState, lines };
      },
    },
  ),
);

export function useCart() {
  return useCartStore(
    useShallow((s) => ({
      lines: s.lines,
      totalCount: s.lines.reduce((sum, l) => sum + l.quantity, 0),
      add: s.add,
      setLineQuantity: s.setLineQuantity,
      setLines: s.setLines,
      clear: s.clear,
    })),
  );
}
