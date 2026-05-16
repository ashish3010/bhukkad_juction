import Link from "next/link";
import { useRouter } from "next/router";
import { AppLogo } from "@/features/layout/components/AppLogo";
import { IconBag, IconGrid, IconHome, IconX } from "@/shared/components/icons";
import { useCart } from "@/features/cart/cart-store";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { key: "home", href: "/home", label: "Home", icon: IconHome },
  { key: "categories", href: "/home#categories", label: "Categories", icon: IconGrid },
  { key: "cart", href: "/order-summary", label: "Cart", icon: IconBag, badge: true as const },
];

function isActiveItem(key: string, pathname: string, asPath: string): boolean {
  if (key === "home") return pathname === "/home" && !asPath.includes("#categories");
  if (key === "categories") return pathname === "/home" && asPath.includes("#categories");
  if (key === "cart") return pathname === "/order-summary" || pathname.startsWith("/checkout/");
  return false;
}

export function NavDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const { totalCount } = useCart();
  const { pathname, asPath } = router;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav
        className="absolute left-0 top-0 flex h-full w-[min(88%,280px)] flex-col bg-[#141414] py-4 shadow-2xl ring-1 ring-white/10"
        aria-label="Main menu"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-4">
          <div className="flex min-w-0 items-center gap-2">
            <AppLogo width={32} decorative />
            <span className="text-sm font-semibold text-[var(--bj-gold)]">Menu</span>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:bg-white/10"
            aria-label="Close"
            onClick={onClose}
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pt-4">
          {navItems.map(({ key, href, label, icon: Icon, badge }) => {
            const active = isActiveItem(key, pathname, asPath);
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    active ? "bg-white/10 text-[var(--bj-gold)]" : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={onClose}
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
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
      </nav>
    </div>
  );
}
