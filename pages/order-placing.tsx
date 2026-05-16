import dynamic from "next/dynamic";
import { MainAppShell } from "@/features/layout/MainAppShell";

function OrderPlacingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-900 from-0% via-[var(--bj-bg)] via-45% to-[#0a0a0a] px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className="h-14 w-14 animate-spin rounded-full border-2 border-[var(--bj-gold)]/30 border-t-[var(--bj-gold)]"
        aria-hidden
      />
      <p className="mt-8 text-center text-sm font-medium text-zinc-200">Placing your order…</p>
      <p className="mt-1 text-center text-xs text-zinc-500">Hang tight — almost there</p>
    </div>
  );
}

const OrderPlacingWaitingScreen = dynamic(
  () => import("@/features/checkout/OrderPlacingWaitingScreen").then((m) => m.OrderPlacingWaitingScreen),
  {
    ssr: false,
    loading: OrderPlacingLoading,
  }
);

export default function OrderPlacingPage() {
  return (
    <MainAppShell showAppHeader={false}>
      <OrderPlacingWaitingScreen />
    </MainAppShell>
  );
}
