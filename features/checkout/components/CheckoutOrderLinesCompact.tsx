import Image from "next/image";
import { memo, useCallback } from "react";
import { IconMinus, IconPlus } from "@/shared/components/icons";
import { useCartStore } from "@/features/cart/cart-store";
import { useCommon } from "@/shared/data/common-copy-provider";
import { replaceCopy } from "@/shared/data/common";
import { useMenuStore } from "@/shared/data/menu";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import type { CartLine, Product } from "@/shared/types/food";

const stepBtn =
  "flex size-8 shrink-0 items-center justify-center rounded-full transition active:scale-95";

type LineProps = { line: CartLine; product: Product };

const CompactLineRow = memo(function CompactLineRow({ line, product }: LineProps) {
  const common = useCommon();
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);
  const lineTotal = product.price * line.quantity;

  const onDec = useCallback(() => {
    setLineQuantity(line.productId, line.quantity - 1);
  }, [setLineQuantity, line.productId, line.quantity]);

  const onInc = useCallback(() => {
    setLineQuantity(line.productId, line.quantity + 1);
  }, [setLineQuantity, line.productId, line.quantity]);

  return (
    <li className="flex gap-3 border-b border-stone-200/90 pb-3 last:border-b-0 last:pb-0 dark:border-zinc-700/90">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-zinc-800">
        <Image src={resolveImageSrc(product.image)} alt="" fill className="object-cover object-center" sizes="56px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm font-semibold leading-snug text-stone-900 dark:text-zinc-100">{product.name}</p>
        {product.subtitle?.trim() ? (
          <p className="text-xs text-stone-500 dark:text-zinc-400">{product.subtitle.trim()}</p>
        ) : null}
        <div className="inline-flex w-fit max-w-full items-center gap-0.5">
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
            <span className="min-w-[1.75rem] px-1.5 text-center text-xs font-bold tabular-nums leading-none text-stone-900 dark:text-zinc-100">
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
        </div>
      </div>
      <span className="shrink-0 self-start pt-0.5 text-sm font-semibold tabular-nums text-stone-900 dark:text-zinc-100">
        ₹{lineTotal}
      </span>
    </li>
  );
});

export function CheckoutOrderLinesCompact() {
  const products = useMenuStore((s) => s.products);
  const lines = useCartStore((s) => s.lines);

  return (
    <ul className="space-y-3">
      {lines.map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        return <CompactLineRow key={line.productId} line={line} product={product} />;
      })}
    </ul>
  );
}
