import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { readOrderHistory, type StoredOrder } from "@/features/orders/order-history-storage";
import { OrderItemsSummaryCollapsible } from "@/features/orders/components/OrderItemsSummaryCollapsible";
import { useCartStore } from "@/features/cart/cart-store";
import { IconCheck } from "@/shared/components/icons";
import { useCommon } from "@/shared/data/common-copy-provider";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import { getProductById, useMenuStore } from "@/shared/data/menu";

const FALLBACK_THUMB = "/images/litti_chokha.png";
const ORDERS_PAGE_SIZE = 5;

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

export function DesktopOrdersDashboardView() {
  const common = useCommon();
  const products = useMenuStore((s) => s.products);
  const d = common.desktop.ordersDashboard;
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [shownPages, setShownPages] = useState(1);

  const refresh = useCallback(() => {
    setOrders(readOrderHistory());
  }, []);

  const visibleCount = Math.min(orders.length, shownPages * ORDERS_PAGE_SIZE);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate order history from localStorage after mount */
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

  const loadMoreOrders = useCallback(() => {
    setShownPages((p) => p + 1);
  }, []);

  const onReorder = useCallback(
    (order: StoredOrder) => {
      for (const line of order.lines) {
        if (!getProductById(line.productId)) continue;
        add(line.productId, line.quantity);
      }
      void router.push("/order-summary");
    },
    [add, router, products],
  );

  const visibleOrders = orders.slice(0, visibleCount);
  const hasMoreOrders = visibleCount < orders.length;

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] pb-16 pt-10">
        <div className="mx-auto max-w-5xl pr-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">{d.pageTitle}</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-zinc-400">{d.pageSubtitle}</p>
          <div className="mt-10 rounded-2xl border border-stone-200/90 bg-[var(--bj-card)] p-12 text-center shadow-sm ring-1 ring-stone-200/60 dark:border-zinc-800/90 dark:ring-zinc-800/80">
            <p className="text-base font-medium text-stone-800 dark:text-zinc-200">{common.orders.emptyTitle}</p>
            <p className="mt-2 text-sm text-stone-500 dark:text-zinc-500">{common.orders.emptyBody}</p>
            <Link
              href="/home"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[var(--bj-gold-fill)] px-8 py-3 text-sm font-bold text-[#1a1203] shadow-[0_8px_24px_rgba(250,204,21,0.25)] transition hover:brightness-105"
            >
              {d.browseMenu}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] pb-16 pt-8">
      <div className="mx-auto max-w-5xl pr-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">{d.pageTitle}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-zinc-400">{d.pageSubtitle}</p>

        <section id="order-history-table" className="mt-10 scroll-mt-28">
          <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-[var(--bj-card)] shadow-sm ring-1 ring-stone-200/60 dark:border-zinc-800 dark:ring-zinc-800/80">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/90 dark:border-zinc-800 dark:bg-zinc-900/80">
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                      {d.colDate}
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                      {d.colItems}
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                      {d.colStatus}
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                      {d.colTotal}
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                      {d.colActions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-stone-200/90 last:border-0 hover:bg-stone-50/80 dark:border-zinc-800/90 dark:hover:bg-zinc-900/50"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-stone-600 dark:text-zinc-400">
                        {formatOrderDate(order.placedAt)}
                      </td>
                      <td className="max-w-[280px] px-4 py-4">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
                            <Image
                              src={resolveImageSrc(order.previewImage || FALLBACK_THUMB)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <OrderItemsSummaryCollapsible
                            text={lineSummary(order)}
                            textClassName="text-sm leading-snug text-stone-800 dark:text-zinc-200"
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                          <IconCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          {common.orders.delivered}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-stone-900 dark:text-white">
                        ₹{order.total}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => onReorder(order)}
                          className="rounded-lg border border-[var(--bj-gold-fill)]/50 bg-transparent px-3 py-1.5 text-xs font-bold text-[var(--bj-gold-fill)] transition hover:bg-[var(--bj-gold-fill)]/10"
                        >
                          {common.orders.reorder}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {hasMoreOrders ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={loadMoreOrders}
                className="text-sm font-semibold text-[var(--bj-gold-fill)] underline decoration-[var(--bj-gold-fill)]/40 underline-offset-4 hover:decoration-[var(--bj-gold-fill)]"
              >
                {d.viewAllOrders}
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
