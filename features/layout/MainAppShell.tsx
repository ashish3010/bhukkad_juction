import type { ReactNode } from "react";
import { AppHeader } from "@/features/layout/components/AppHeader";
import { AppHeaderDesktop } from "@/features/layout/components/AppHeaderDesktop";

type Props = {
  children: ReactNode;
  /** Set false when the page has its own top bar (e.g. order summary). */
  showAppHeader?: boolean;
};

export function MainAppShell({ children, showAppHeader = true }: Props) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-[var(--bj-bg)] pb-8 text-stone-900 dark:text-zinc-100 desktop:max-w-[min(1400px,calc(100%-3rem))] desktop:px-0">
      {showAppHeader ? (
        <>
          <AppHeader />
          <AppHeaderDesktop />
        </>
      ) : null}
      <main id="main-content">{children}</main>
    </div>
  );
}
