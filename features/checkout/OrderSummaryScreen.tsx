import Link from "next/link";
import { useMemo } from "react";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { CheckoutAddressFlow } from "@/features/checkout/CheckoutAddressFlow";
import { PriceSummary } from "@/features/checkout/components/PriceSummary";
import { SelectionList } from "@/features/checkout/components/SelectionList";
import { useCart } from "@/features/cart/cart-store";
import { IconArrowRight } from "@/shared/components/icons";
import { common } from "@/shared/data/common";
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
    <>
      <div className="block min-[601px]:hidden">
        <div className="pb-8">
          <div className="mx-auto w-full max-w-[1360px]">
            <CheckoutStepper current={1} />
            <div className="space-y-2 pt-2">
              <div className="space-y-2">
                <SelectionList />
              </div>
              <div className="space-y-2">
                {lines.length > 0 ? (
                  <div className="rounded-2xl border border-stone-200/80 bg-[var(--bj-card)] shadow-sm dark:border-zinc-800/80 dark:shadow-none">
                    <p className="hidden px-5 pt-5 text-xs font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                      {common.desktop.cartPage.summaryAsideTitle}
                    </p>
                    <PriceSummary total={total} />
                    <div className="px-4 pb-5 pt-2">
                      <Link
                        href="/checkout/delivery"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--bj-gold-fill)] py-3.5 text-sm font-semibold text-[#1a1203] shadow-[0_8px_24px_rgba(240,180,41,0.35)] transition hover:brightness-105 active:scale-[0.98]"
                      >
                        {common.cart.continueToDelivery}
                        <IconArrowRight className="h-5 w-5 shrink-0" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pt-2">
                    <Link
                      href="/home"
                      className="flex w-full items-center justify-center rounded-full bg-[var(--bj-gold-fill)] px-5 py-3.5 text-sm font-semibold text-[#1a1203] shadow-[0_8px_24px_rgba(240,180,41,0.35)] transition hover:brightness-105 active:scale-[0.98]"
                    >
                      {common.cart.browseMenu}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-[601px]:block">
        {lines.length === 0 ? (
          <div className="pb-12">
            <div className="mx-auto max-w-[1360px] pr-6 pt-8">
              <SelectionList />
              <div className="mt-8 flex justify-center">
                <Link
                  href="/home"
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-[var(--bj-gold-fill)] px-8 py-3.5 text-sm font-semibold text-[#1a1203] shadow-[0_8px_24px_rgba(240,180,41,0.25)] transition hover:brightness-105 active:scale-[0.99] sm:w-auto sm:min-w-[220px]"
                >
                  {common.cart.browseMenu}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <CheckoutAddressFlow
            emptyBookCancel="stay-on-form"
            hidePaymentAndCouponOnDesktop
            editCartHref="/home"
          />
        )}
      </div>
    </>
  );
}
