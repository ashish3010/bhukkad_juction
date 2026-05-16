import { OrderSummaryScreen } from "@/features/checkout/OrderSummaryScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";

export default function OrderSummaryPage() {
  return (
    <MainAppShell>
      <OrderSummaryScreen />
    </MainAppShell>
  );
}
