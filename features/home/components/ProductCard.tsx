import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/shared/components/ui/Button";
import { IconMinus, IconPlus } from "@/shared/components/icons";
import { useCart } from "@/features/cart/cart-store";
import { formatProductPrice } from "@/shared/data/menu";
import type { Product } from "@/shared/types/food";

const stepBtn =
  "flex size-7 shrink-0 items-center justify-center rounded-full transition active:scale-95 disabled:opacity-50";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { lines, add, setLineQuantity } = useCart();

  const qty = useMemo(
    () => lines.find((l) => l.productId === product.id)?.quantity ?? 0,
    [lines, product.id],
  );

  return (
    <div className="overflow-hidden rounded-2xl bg-[#161616] ring-1 ring-white/5">
      <div className="relative aspect-square w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width:448px) 45vw, 200px"
        />
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-3 text-xs font-semibold leading-snug text-white">{product.name}</p>
        {product.subtitle ? (
          <p className="line-clamp-2 text-[11px] text-zinc-500">{product.subtitle}</p>
        ) : null}
        <p className="text-sm font-bold text-[var(--bj-gold)]">{formatProductPrice(product)}</p>
        {qty === 0 ? (
          <Button
            type="button"
            variant="primary"
            className="w-full py-2 text-[11px] font-bold"
            onClick={() => add(product.id, 1)}
          >
            <IconPlus className="h-3.5 w-3.5" />
            Add to cart
          </Button>
        ) : (
          <div
            className="inline-flex w-fit max-w-full items-center gap-0 rounded-full bg-[#1a1a1a] p-0.5 ring-1 ring-white/10"
            role="group"
            aria-label="Quantity"
          >
            <button
              type="button"
              className={`${stepBtn} bg-zinc-800 text-white hover:bg-zinc-700`}
              aria-label="Decrease quantity"
              onClick={() => setLineQuantity(product.id, qty - 1)}
            >
              <IconMinus className="h-3 w-3 shrink-0" />
            </button>
            <span className="px-2 text-center text-xs font-bold tabular-nums leading-none text-white">
              {qty}
            </span>
            <button
              type="button"
              className={`${stepBtn} bg-[var(--bj-gold)] text-[#1a1203] shadow-[0_2px_6px_rgba(255,193,7,0.2)] hover:brightness-105`}
              aria-label="Increase quantity"
              onClick={() => setLineQuantity(product.id, qty + 1)}
            >
              <IconPlus className="h-3 w-3 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
