import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/features/cart/cart-store";
import { CheckoutAddressFlow } from "@/features/checkout/CheckoutAddressFlow";

export function DeliveryScreen() {
  const router = useRouter();
  const { lines } = useCart();

  useEffect(() => {
    if (lines.length === 0) {
      void router.replace("/order-summary");
    }
  }, [lines.length, router]);

  if (lines.length === 0) {
    return <div className="min-h-[40vh] bg-[var(--bj-bg)]" aria-hidden />;
  }

  return <CheckoutAddressFlow emptyBookCancel="navigate-order-summary" />;
}
