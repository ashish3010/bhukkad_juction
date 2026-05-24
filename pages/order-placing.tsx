import dynamic from "next/dynamic";
import { MainAppShell } from "@/features/layout/MainAppShell";
import { useCommon } from "@/shared/data/common-copy-provider";

function OrderPlacingLoading() {
  const common = useCommon();
  const t = common.orderPlacing;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 from-0% via-[var(--bj-bg)] via-45% to-stone-100 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] dark:from-zinc-950 dark:via-[var(--bj-bg)] dark:to-zinc-950">
      <div
        className="h-14 w-14 animate-spin rounded-full border-2 border-[var(--bj-gold-fill)]/30 border-t-[var(--bj-gold)]"
        aria-hidden
      />
      <p className="mt-8 text-center text-sm font-medium text-stone-800 dark:text-zinc-200">{t.loadingPrimary}</p>
      <p className="mt-1 text-center text-xs text-stone-500 dark:text-zinc-500">{t.loadingSecondary}</p>
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
