import Image from "next/image";
import { memo, useCallback } from "react";
import { Button } from "@/shared/components/ui/Button";
import { IconMinus, IconPlus } from "@/shared/components/icons";
import { useCartStore } from "@/features/cart/cart-store";
import { useCommon } from "@/shared/data/common-copy-provider";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import { formatProductPrice } from "@/shared/data/menu";
import type { Product } from "@/shared/types/food";

const stepBtn =
  "flex size-8 shrink-0 items-center justify-center rounded-full transition active:scale-95 disabled:opacity-50";

type Props = {
  product: Product;
  /** Desktop / alternate label for the primary add action (default: add-to-cart copy from `useCommon()`). */
  ctaLabel?: string;
  /** Passed to `next/image` `sizes` for responsive loading. */
  imageSizes?: string;
};

export const ProductCard = memo(function ProductCard({
  product,
  ctaLabel,
  imageSizes,
}: Props) {
  const common = useCommon();
  const qty = useCartStore(
    (s) => s.lines.find((l) => l.productId === product.id)?.quantity ?? 0,
  );
  const add = useCartStore((s) => s.add);
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);

  const onAdd = useCallback(() => {
    add(product.id, 1);
  }, [add, product.id]);

  const onDec = useCallback(() => {
    setLineQuantity(product.id, qty - 1);
  }, [setLineQuantity, product.id, qty]);

  const onInc = useCallback(() => {
    setLineQuantity(product.id, qty + 1);
  }, [setLineQuantity, product.id, qty]);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative aspect-square w-full">
        <Image
          src={resolveImageSrc(product.image)}
          alt={product.name}
          fill
          className="object-cover object-center"
          sizes={imageSizes ?? "(max-width:448px) 45vw, 200px"}
        />
        {product.bestseller ? (
          <span
            className="pointer-events-none absolute left-2 top-2 z-[1] rounded-md bg-[var(--bj-gold-fill)] px-2 py-1 text-[10px] font-bold uppercase leading-none tracking-wide text-[#1a1203] shadow-sm ring-1 ring-[var(--bj-gold)]/50"
            role="status"
          >
            {common.productCard.bestsellerBadge}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-3 text-xs font-semibold leading-snug text-stone-800 dark:text-zinc-100">
          {product.name}
        </p>
        {product.subtitle ? (
          <p className="line-clamp-2 text-[11px] text-stone-500 dark:text-zinc-400">
            {product.subtitle}
          </p>
        ) : null}
        <p className="text-sm font-bold text-[var(--bj-gold)]">
          {formatProductPrice(product)}
        </p>
        {qty === 0 ? (
          <Button
            type="button"
            variant="primary"
            className="w-full py-2 text-[11px] font-bold"
            onClick={onAdd}
          >
            <IconPlus className="h-3.5 w-3.5" />
            {ctaLabel ?? common.productCard.addToCart}
          </Button>
        ) : (
          <div
            className="inline-flex w-fit max-w-full items-center gap-0 rounded-full bg-stone-100 p-0.5 ring-1 ring-stone-200 dark:bg-zinc-800 dark:ring-zinc-700"
            role="group"
            aria-label={common.aria.quantity}
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
              {qty}
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
        )}
      </div>
    </div>
  );
});
