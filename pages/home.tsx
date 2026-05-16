import { HomeScreen } from "@/features/home/HomeScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";

export default function HomePage() {
  return (
    <MainAppShell>
      <HomeScreen />
    </MainAppShell>
  );
}
