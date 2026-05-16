import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/features/cart/cart-store";
import { readOrderHistory, type StoredOrder } from "@/features/orders/order-history-storage";
import { getProductById } from "@/shared/data/menu";
import { common } from "@/shared/data/common";
import { IconArrowLeft, IconReceipt } from "@/shared/components/icons";

const card =
  "rounded-2xl border border-stone-200/90 bg-[var(--bj-card)] p-4 shadow-sm dark:border-zinc-800/90 dark:shadow-none";

const FALLBACK_THUMB = "/images/litti_chokha.png";

function formatOrderDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function lineSummary(order: StoredOrder): string {
  return order.lines.map((l) => `${l.name} × ${l.quantity}`).join(", ");
}

export function OrdersScreen() {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  const refresh = useCallback(() => {
    setOrders(readOrderHistory());
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- bootstrap order history from localStorage after mount */
    refresh();
    /* eslint-enable react-hooks/set-state-in-effect */
    window.addEventListener("focus", refresh);
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  const onReorder = useCallback(
    (order: StoredOrder) => {
      for (const line of order.lines) {
        if (!getProductById(line.productId)) continue;
        add(line.productId, line.quantity);
      }
      void router.push("/order-summary");
    },
    [add, router],
  );

  return (
    <div className="pb-10">
      <div className="sticky top-[var(--bj-sticky-back-top)] z-30 border-b border-stone-200/80 bg-[var(--bj-bg)]/95 px-4 py-2.5 backdrop-blur-md dark:border-zinc-800/80">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <IconArrowLeft className="h-4 w-4 shrink-0" />
          {common.orders.backToMenu}
        </Link>
      </div>

      <div className="px-4 pt-5">
        <div className="flex items-center gap-2">
          <IconReceipt className="h-6 w-6 shrink-0 text-[var(--bj-gold)]" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--bj-gold)]">{common.orders.title}</h1>
        </div>
        <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">{common.orders.subtitle}</p>
      </div>

      <div className="mt-6 space-y-3 px-4">
        {orders.length === 0 ? (
          <div className={`${card} py-10 text-center`}>
            <p className="text-sm font-medium text-stone-700 dark:text-zinc-300">{common.orders.emptyTitle}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-zinc-500">{common.orders.emptyBody}</p>
            <Link
              href="/home"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--bj-gold-fill)] px-5 py-2.5 text-sm font-semibold text-[#1a1203] shadow-[0_6px_20px_rgba(240,180,41,0.3)] transition hover:brightness-105"
            >
              {common.orders.browseMenu}
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">{common.orders.historyHeading}</h2>
            <ul className="space-y-3">
              {orders.map((order) => {
                const thumb = order.previewImage || FALLBACK_THUMB;
                return (
                  <li key={order.orderId}>
                    <div className={card}>
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
                          <Image src={thumb} alt="" fill className="object-cover object-center" sizes="80px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-stone-500 dark:text-zinc-500">{formatOrderDate(order.placedAt)}</p>
                            <span className="shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{common.orders.delivered}</span>
                          </div>
                          <p className="mt-0.5 text-xs font-semibold text-stone-800 dark:text-zinc-200">#{order.orderId}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-snug text-stone-600 dark:text-zinc-400">{lineSummary(order)}</p>
                          <p className="mt-2 text-sm font-bold text-[var(--bj-gold)]">₹{order.total}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onReorder(order)}
                        className="mt-3 w-full rounded-full border border-[var(--bj-gold)]/60 bg-transparent py-2.5 text-xs font-bold text-[var(--bj-gold)] transition hover:bg-[var(--bj-gold-fill)]/15 active:scale-[0.99]"
                      >
                        {common.orders.reorder}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
