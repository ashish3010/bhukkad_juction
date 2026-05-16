import { OrdersScreen } from "@/features/orders/OrdersScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";

export default function OrdersPage() {
  return (
    <MainAppShell>
      <OrdersScreen />
    </MainAppShell>
  );
}
