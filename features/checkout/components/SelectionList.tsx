import Image from "next/image";
import { memo, useCallback } from "react";
import { Card } from "@/shared/components/ui/Card";
import { IconMinus, IconPlus, IconTrash } from "@/shared/components/icons";
import { useCartStore } from "@/features/cart/cart-store";
import { common, replaceCopy } from "@/shared/data/common";
import { formatProductPrice, getProductById } from "@/shared/data/menu";
import type { CartLine, Product } from "@/shared/types/food";

const stepBtn =
  "flex size-8 shrink-0 items-center justify-center rounded-full transition active:scale-95";

const deleteBtn =
  "flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e53935] bg-transparent p-0 transition hover:bg-[#e53935]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e53935]/55";

type LineRowProps = { line: CartLine; product: Product };

const SelectionLineRow = memo(function SelectionLineRow({ line, product }: LineRowProps) {
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);
  const lineTotal = product.price * line.quantity;

  const onDec = useCallback(() => {
    setLineQuantity(line.productId, line.quantity - 1);
  }, [setLineQuantity, line.productId, line.quantity]);

  const onInc = useCallback(() => {
    setLineQuantity(line.productId, line.quantity + 1);
  }, [setLineQuantity, line.productId, line.quantity]);

  const onRemove = useCallback(() => {
    setLineQuantity(line.productId, 0);
  }, [setLineQuantity, line.productId]);

  return (
    <Card className="flex gap-3 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={product.image} alt="" fill className="object-cover object-center" sizes="64px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="font-semibold leading-snug text-stone-900 dark:text-zinc-100">{product.name}</p>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          {formatProductPrice(product)}
          {common.cart.eachSuffix}
        </p>
        <div className="inline-flex w-fit max-w-full items-center gap-1">
          <div
            className="inline-flex items-center gap-0 rounded-full bg-stone-100 p-0.5 ring-1 ring-stone-200 dark:bg-zinc-800 dark:ring-zinc-700"
            role="group"
            aria-label={replaceCopy(common.aria.quantityForProduct, { name: product.name })}
          >
            <button
              type="button"
              className={`${stepBtn} bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600`}
              aria-label={common.aria.decreaseQuantity}
              onClick={onDec}
            >
              <IconMinus className="h-3.5 w-3.5 shrink-0" />
            </button>
            <span className="px-2 text-center text-xs font-bold tabular-nums leading-none text-stone-900 dark:text-zinc-100">
              {line.quantity}
            </span>
            <button
              type="button"
              className={`${stepBtn} bg-[var(--bj-gold-fill)] text-[#1a1203] shadow-[0_2px_6px_rgba(240,180,41,0.35)] hover:brightness-105`}
              aria-label={common.aria.increaseQuantity}
              onClick={onInc}
            >
              <IconPlus className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>
          <button
            type="button"
            className={deleteBtn}
            aria-label={replaceCopy(common.aria.removeFromCart, { name: product.name })}
            onClick={onRemove}
          >
            <IconTrash className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
      <p className="shrink-0 self-center text-sm font-semibold text-stone-900 dark:text-zinc-100">₹{lineTotal}</p>
    </Card>
  );
});

export function SelectionList() {
  const lines = useCartStore((s) => s.lines);

  if (lines.length === 0) {
    return (
      <section className="space-y-3 px-4 min-[601px]:px-0">
        <h2 className="text-sm font-bold text-[var(--bj-gold)]">{common.cart.yourSelection}</h2>
        <p className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          {common.cart.emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3 px-4 min-[601px]:px-0">
      <h2 className="text-sm font-bold text-[var(--bj-gold)]">{common.cart.yourSelection}</h2>
      <div className="space-y-3">
        {lines.map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          return <SelectionLineRow key={line.productId} line={line} product={product} />;
        })}
      </div>
    </section>
  );
}
