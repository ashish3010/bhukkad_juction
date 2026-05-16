import Link from "next/link";
import { useRouter } from "next/router";
import { startTransition, useEffect, useState } from "react";
import {
  clearOrderPlacedSnapshot,
  readOrderPlacedSnapshot,
  type OrderPlacedSnapshot,
} from "@/features/checkout/order-placed-snapshot";
import {
  IconCheck,
  IconHash,
  IconMap,
  IconMapPin,
  IconReceipt,
} from "@/shared/components/icons";

const card = "rounded-2xl border border-white/5 bg-[var(--bj-card)] p-4";

export function OrderPlacedScreen() {
  const router = useRouter();
  const [snap, setSnap] = useState<OrderPlacedSnapshot | null>(null);

  useEffect(() => {
    const s = readOrderPlacedSnapshot();
    if (!s) {
      void router.replace("/home");
      return;
    }
    startTransition(() => setSnap(s));
  }, [router]);

  if (!snap) {
    return <div className="min-h-[50vh] bg-[var(--bj-bg)]" aria-hidden />;
  }

  const onBackHome = () => {
    clearOrderPlacedSnapshot();
  };

  return (
    <div className="space-y-5 px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="relative flex flex-col items-center pt-6">
        <span
          className="absolute left-[12%] top-2 flex h-9 w-9 rotate-[-12deg] items-center justify-center rounded-lg bg-zinc-800 text-lg shadow-lg ring-1 ring-white/10"
          aria-hidden
        >
          🎉
        </span>
        <span
          className="absolute right-[14%] top-3 flex h-9 w-9 rotate-[10deg] items-center justify-center rounded-lg bg-zinc-800 text-lg shadow-lg ring-1 ring-white/10"
          aria-hidden
        >
          🍴
        </span>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bj-gold)] shadow-[0_0_40px_rgba(255,193,7,0.45)] ring-4 ring-[var(--bj-gold)]/25">
          <IconCheck className="h-10 w-10 text-[#1a1203]" />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-[var(--bj-gold)]">Order Placed Successfully!</h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-zinc-400">
          Your delicious meal is being prepared with love.
        </p>
      </div>

      <div className={card}>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-[var(--bj-gold)]">
            <IconHash className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-zinc-500">Order ID</p>
            <p className="text-sm font-bold text-white">#{snap.orderId}</p>
          </div>
        </div>
      </div>

      <div className={`${card} relative overflow-hidden`}>
        <div className="pointer-events-none absolute -right-4 bottom-0 opacity-[0.07]">
          <IconMap className="h-28 w-28 text-white" />
        </div>
        <div className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--bj-gold)]">
          <IconMapPin className="h-4 w-4" />
          Delivery to
        </div>
        <p className="relative mt-3 text-base font-semibold text-white">{snap.deliveryTitle}</p>
        <p className="relative mt-1 text-sm leading-relaxed text-zinc-400">{snap.deliveryAddress}</p>
      </div>

      <div className={card}>
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--bj-gold)]">
          <IconReceipt className="h-4 w-4" />
          Order summary
        </div>
        <ul className="space-y-2 border-b border-white/5 pb-3 text-sm">
          {snap.lines.map((l, i) => (
            <li key={`${l.name}-${i}`} className="flex justify-between gap-3 text-zinc-300">
              <span className="min-w-0">
                {l.quantity}× {l.name}
              </span>
              <span className="shrink-0 font-medium text-white">₹{l.lineTotal}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-white">Total Amount</span>
          <span className="text-lg font-bold text-[var(--bj-gold)]">₹{snap.total}</span>
        </div>
      </div>

      <div className="pt-2">
        <Link
          href="/home"
          onClick={onBackHome}
          className="flex w-full items-center justify-center rounded-full border border-white/15 bg-transparent py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
