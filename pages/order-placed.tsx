import { OrderPlacedScreen } from "@/features/checkout/OrderPlacedScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";

export default function OrderPlacedPage() {
  return (
    <MainAppShell showAppHeader={false}>
      <OrderPlacedScreen />
    </MainAppShell>
  );
}
