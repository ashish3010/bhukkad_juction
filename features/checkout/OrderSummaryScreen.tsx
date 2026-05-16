import Link from "next/link";
import { useMemo } from "react";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { useCart } from "@/features/cart/cart-store";
import { PriceSummary } from "@/features/checkout/components/PriceSummary";
import { SelectionList } from "@/features/checkout/components/SelectionList";
import { IconArrowLeft, IconArrowRight } from "@/shared/components/icons";
import { getProductById } from "@/shared/data/menu";

export function OrderSummaryScreen() {
  const { lines } = useCart();

  const total = useMemo(() => {
    return lines.reduce((sum, line) => {
      const p = getProductById(line.productId);
      return sum + (p ? p.price * line.quantity : 0);
    }, 0);
  }, [lines]);

  return (
    <div className="pb-8">
      <div className="sticky top-[var(--bj-sticky-back-top)] z-30 border-b border-white/5 bg-[var(--bj-bg)]/95 px-4 py-2.5 backdrop-blur-md">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          <IconArrowLeft className="h-4 w-4 shrink-0" />
          Back to menu
        </Link>
      </div>
      <CheckoutStepper current={1} />
      <div className="space-y-2 pt-2">
        <SelectionList />
        <PriceSummary total={total} />
        {lines.length > 0 ? (
          <div className="px-4 pt-2">
            <Link
              href="/checkout/delivery"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--bj-gold)] py-3.5 text-sm font-semibold text-[#1a1203] shadow-[0_8px_24px_rgba(255,193,7,0.25)] transition hover:brightness-105 active:scale-[0.98]"
            >
              Continue to delivery
              <IconArrowRight className="h-5 w-5 shrink-0" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
