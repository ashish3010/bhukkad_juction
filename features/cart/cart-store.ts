import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { CartLine } from "@/shared/types/food";

type CartStore = {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  setLineQuantity: (productId: string, quantity: number) => void;
  setLines: (lines: CartLine[]) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
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
}));

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
