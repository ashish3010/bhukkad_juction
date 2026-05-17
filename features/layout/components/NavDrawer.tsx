import Link from "next/link";
import { useRouter } from "next/router";
import { AppLogo } from "@/features/layout/components/AppLogo";
import { IconBag, IconGrid, IconHome, IconLeaf, IconReceipt, IconX } from "@/shared/components/icons";
import { useCartStore } from "@/features/cart/cart-store";
import { useTheme } from "@/features/theme/theme-context";
import { common } from "@/shared/data/common";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navConfig = [
  { key: "home", href: "/home", labelKey: "home" as const, icon: IconHome },
  { key: "ourStory", href: "/our-story", labelKey: "ourStory" as const, icon: IconLeaf },
  { key: "categories", href: "/home#categories", labelKey: "categories" as const, icon: IconGrid },
  { key: "orders", href: "/orders", labelKey: "orders" as const, icon: IconReceipt },
  { key: "cart", href: "/order-summary", labelKey: "cart" as const, icon: IconBag, badge: true as const },
];

function isActiveItem(key: string, pathname: string, asPath: string): boolean {
  if (key === "home") return pathname === "/home" && !asPath.includes("#categories");
  if (key === "ourStory") return pathname === "/our-story";
  if (key === "categories") return pathname === "/home" && asPath.includes("#categories");
  if (key === "cart") return pathname === "/order-summary" || pathname.startsWith("/checkout/");
  if (key === "orders") return pathname === "/orders";
  return false;
}

export function NavDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const totalCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const { pathname, asPath } = router;
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/25 backdrop-blur-sm dark:bg-black/55"
        aria-label={common.aria.closeMenu}
        onClick={onClose}
      />
      <nav
        className="absolute left-0 top-0 flex h-full w-[min(88%,280px)] flex-col bg-white py-4 shadow-2xl ring-1 ring-stone-200 dark:bg-zinc-950 dark:ring-zinc-800"
        aria-label={common.aria.mainMenu}
      >
        <div className="flex items-center justify-between border-b border-stone-300 px-4 pb-4 dark:border-zinc-700">
          <div className="flex min-w-0 items-center gap-2">
            <AppLogo width={32} decorative circleCrop />
            <span className="text-sm font-semibold text-stone-900 dark:text-zinc-100">{common.nav.drawerMenuLabel}</span>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={common.aria.close}
            onClick={onClose}
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pt-4">
          {navConfig.map(({ key, href, labelKey, icon: Icon, badge }) => {
            const active = isActiveItem(key, pathname, asPath);
            const label = common.nav[labelKey];
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                    active
                      ? "border border-amber-500/80 bg-amber-100 font-semibold text-amber-950 shadow-sm dark:border-amber-500/50 dark:bg-amber-500/15 dark:text-amber-100 dark:shadow-none"
                      : "border border-transparent font-medium text-stone-900 hover:border-stone-200 hover:bg-stone-100 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                  }`}
                  onClick={onClose}
                >
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-amber-200 text-amber-950 ring-1 ring-amber-500/40 dark:bg-amber-500/25 dark:text-amber-50 dark:ring-amber-400/40"
                        : "bg-stone-200 text-stone-800 ring-1 ring-stone-300/80 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600/80"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {badge && totalCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {totalCount > 9 ? "9+" : totalCount}
                      </span>
                    ) : null}
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto border-t border-stone-300 px-4 pb-1 pt-4 dark:border-zinc-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-500">{common.nav.appearance}</p>
          <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label={common.aria.theme}>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition ${
                theme === "light"
                  ? "border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-400 dark:bg-amber-500/20 dark:text-amber-50"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {common.nav.light}
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-400 dark:bg-amber-500/20 dark:text-amber-50"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {common.nav.dark}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
