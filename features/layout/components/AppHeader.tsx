import { useState } from "react";
import Link from "next/link";
import { IconBag, IconMenu } from "@/shared/components/icons";
import { NavDrawer } from "@/features/layout/components/NavDrawer";
import { useCart } from "@/features/cart/cart-store";
import { SITE_NAME } from "@/shared/site-meta";

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200/80 bg-[var(--bj-bg)]/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md dark:border-zinc-800/80">
        <button
          type="button"
          className="rounded-full p-2 text-stone-700 hover:bg-stone-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <IconMenu />
        </button>
        <Link
          href="/home"
          className="flex min-w-0 flex-1 items-center justify-center px-2"
          aria-label={`${SITE_NAME} — Home`}
        >
          <span className="truncate text-center text-sm font-semibold tracking-tight text-[var(--bj-gold)]">
            {SITE_NAME}
          </span>
        </Link>
        <Link
          href="/order-summary"
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-700 hover:border-[var(--bj-gold)]/35 hover:text-[var(--bj-gold)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-[var(--bj-gold)]/40"
          aria-label={`Cart${totalCount > 0 ? `, ${totalCount} items` : ""}`}
        >
          <IconBag className="h-4 w-4" />
          {totalCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold leading-none text-white">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          ) : null}
        </Link>
      </header>
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
