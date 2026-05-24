import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { IconBag } from "@/shared/components/icons";
import { useCartStore } from "@/features/cart/cart-store";
import { useTheme } from "@/features/theme/theme-context";
import { AppHeaderTopContact } from "@/features/layout/components/AppHeaderTopContact";
import { AppLogo } from "@/features/layout/components/AppLogo";
import { useCommon } from "@/shared/data/common-copy-provider";
import { replaceCopy } from "@/shared/data/common";
import { SITE_NAME } from "@/shared/site-meta";

export function AppHeaderDesktop() {
  const common = useCommon();
  const router = useRouter();
  const totalCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const { theme, setTheme } = useTheme();
  const nav = common.desktop.nav;

  const menuActive = useMemo(() => router.pathname === "/home" || router.pathname === "/", [router.pathname]);
  const storyActive = useMemo(() => router.pathname === "/our-story", [router.pathname]);

  return (
    <header className="sticky top-0 z-50 hidden desktop:block">
      <AppHeaderTopContact />
      <div className="border-b border-stone-200/90 bg-[var(--bj-bg)]/95 py-3 backdrop-blur-md dark:border-zinc-800/90">
        <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between gap-4 pl-4 pr-6">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              href="/home"
              className="flex min-w-0 shrink-0 items-center gap-2.5"
              aria-label={replaceCopy(common.aria.homeLink, { siteName: SITE_NAME })}
            >
              <AppLogo width={40} decorative priority circleCrop />
              <span className="truncate text-lg font-bold tracking-tight text-[var(--bj-gold)]">{SITE_NAME}</span>
            </Link>

            <nav className="flex shrink-0 items-center gap-8" aria-label="Primary">
              <Link
                href="/home"
                className={`shrink-0 text-sm font-semibold transition ${
                  menuActive
                    ? "text-[var(--bj-gold)] underline decoration-[var(--bj-gold)] decoration-2 underline-offset-8"
                    : "text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {nav.menu}
              </Link>
              <Link
                href="/our-story"
                className={`shrink-0 text-sm font-semibold transition ${
                  storyActive
                    ? "text-[var(--bj-gold)] underline decoration-[var(--bj-gold)] decoration-2 underline-offset-8"
                    : "text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {common.nav.ourStory}
              </Link>
              <Link
                href="/orders"
                className={`shrink-0 text-sm font-semibold transition ${
                  router.pathname === "/orders"
                    ? "text-[var(--bj-gold)] underline decoration-[var(--bj-gold)] decoration-2 underline-offset-8"
                    : "text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {common.nav.orders}
              </Link>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/order-summary"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-700 transition hover:border-[var(--bj-gold)]/40 hover:text-[var(--bj-gold)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label={
                totalCount > 0 ? replaceCopy(common.aria.cartWithCount, { count: totalCount }) : common.aria.cart
              }
            >
              <IconBag className="h-5 w-5" />
              {totalCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--bj-gold-fill)] px-1 text-[10px] font-bold text-[#1a1203]">
                  {totalCount > 9 ? "9+" : totalCount}
                </span>
              ) : null}
            </Link>

            <div
              className="flex shrink-0 rounded-full border border-stone-200 bg-stone-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800"
              role="group"
              aria-label={common.aria.theme}
            >
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  theme === "light"
                    ? "bg-[var(--bj-gold-fill)] text-[#1a1203] shadow-sm"
                    : "text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {common.nav.light}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  theme === "dark"
                    ? "bg-[var(--bj-gold-fill)] text-[#1a1203] shadow-sm"
                    : "text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {common.nav.dark}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
