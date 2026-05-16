import Image from "next/image";
import { Card } from "@/shared/components/ui/Card";
import { IconMinus, IconPlus, IconTrash } from "@/shared/components/icons";
import { useCart } from "@/features/cart/cart-store";
import { formatProductPrice, getProductById } from "@/shared/data/menu";

const stepBtn =
  "flex size-7 shrink-0 items-center justify-center rounded-full transition active:scale-95";

const deleteBtn =
  "flex size-7 shrink-0 items-center justify-center rounded-full border border-[#e53935] bg-transparent p-0 transition hover:bg-[#e53935]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e53935]/55";

export function SelectionList() {
  const { lines, setLineQuantity } = useCart();

  if (lines.length === 0) {
    return (
      <section className="space-y-3 px-4">
        <h2 className="text-sm font-bold text-[var(--bj-gold)]">Your Selection</h2>
        <p className="rounded-2xl border border-white/5 bg-[#161616] px-4 py-6 text-center text-sm text-zinc-500">
          Your cart is empty. Add items from the menu on Home.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3 px-4">
      <h2 className="text-sm font-bold text-[var(--bj-gold)]">Your Selection</h2>
      <div className="space-y-3">
        {lines.map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          const lineTotal = product.price * line.quantity;
          return (
            <Card key={line.productId} className="flex gap-3 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={product.image} alt="" fill className="object-cover object-center" sizes="64px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="font-semibold leading-snug text-white">{product.name}</p>
                <p className="text-xs text-zinc-500">
                  {formatProductPrice(product)} each
                </p>
                <div className="inline-flex w-fit max-w-full items-center gap-1">
                  <div
                    className="inline-flex items-center gap-0 rounded-full bg-[#1a1a1a] p-0.5 ring-1 ring-white/10"
                    role="group"
                    aria-label={`Quantity for ${product.name}`}
                  >
                    <button
                      type="button"
                      className={`${stepBtn} bg-zinc-800 text-white hover:bg-zinc-700`}
                      aria-label="Decrease quantity"
                      onClick={() => setLineQuantity(line.productId, line.quantity - 1)}
                    >
                      <IconMinus className="h-3 w-3 shrink-0" />
                    </button>
                    <span className="px-2 text-center text-xs font-bold tabular-nums leading-none text-white">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className={`${stepBtn} bg-[var(--bj-gold)] text-[#1a1203] shadow-[0_2px_6px_rgba(255,193,7,0.2)] hover:brightness-105`}
                      aria-label="Increase quantity"
                      onClick={() => setLineQuantity(line.productId, line.quantity + 1)}
                    >
                      <IconPlus className="h-3 w-3 shrink-0" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={deleteBtn}
                    aria-label={`Remove ${product.name} from cart`}
                    onClick={() => setLineQuantity(line.productId, 0)}
                  >
                    <IconTrash className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </div>
              </div>
              <p className="shrink-0 self-center text-sm font-semibold text-white">₹{lineTotal}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
