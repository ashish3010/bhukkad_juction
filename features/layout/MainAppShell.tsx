import type { ReactNode } from "react";
import { AppHeader } from "@/features/layout/components/AppHeader";

type Props = {
  children: ReactNode;
  /** Set false when the page has its own top bar (e.g. order summary). */
  showAppHeader?: boolean;
};

export function MainAppShell({ children, showAppHeader = true }: Props) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-[var(--bj-bg)] pb-8 text-white">
      {showAppHeader ? <AppHeader /> : null}
      {children}
    </div>
  );
}
