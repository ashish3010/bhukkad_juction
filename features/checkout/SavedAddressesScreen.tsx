import Link from "next/link";
import { useMemo } from "react";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { SelectionList } from "@/features/checkout/components/SelectionList";
import { CHECKOUT_DELIVERY_FEE } from "@/features/checkout/pricing";
import { setDefaultAddress, type SavedAddressEntry } from "@/features/checkout/delivery-address-storage";
import { Button } from "@/shared/components/ui/Button";
import { useCartStore } from "@/features/cart/cart-store";
import { common, replaceCopy } from "@/shared/data/common";
import { SITE_NAME } from "@/shared/site-meta";
import { getProductById } from "@/shared/data/menu";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBriefcase,
  IconCheck,
  IconHome,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconReceipt,
} from "@/shared/components/icons";

type Props = {
  entries: SavedAddressEntry[];
  onRefresh: () => void;
  onAddNew: () => void;
  onEdit: (entry: SavedAddressEntry) => void;
  onPlaceOrder: () => void;
};

function kindTitle(e: SavedAddressEntry): string {
  const c = common.checkout;
  if (e.kind === "home") return c.addressKindHome;
  if (e.kind === "work") return c.addressKindWork;
  return e.customLabel ? replaceCopy(c.addressKindOtherWithLabel, { label: e.customLabel }) : c.addressKindOther;
}

function KindIcon({ kind }: { kind: SavedAddressEntry["kind"] }) {
  if (kind === "home") return <IconHome className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
  if (kind === "work") return <IconBriefcase className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
  return <IconMapPin className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
}

const card =
  "rounded-2xl border border-stone-200/80 bg-[var(--bj-card)] p-5 shadow-sm dark:border-zinc-800/80 dark:shadow-none";

export function SavedAddressesScreen({ entries, onRefresh, onAddNew, onEdit, onPlaceOrder }: Props) {
  const lines = useCartStore((s) => s.lines);
  const lineCount = lines.length;

  const subtotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const p = getProductById(line.productId);
      return sum + (p ? p.price * line.quantity : 0);
    }, 0);
  }, [lines]);
  const deliveryFee = CHECKOUT_DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  const onSelectCard = (id: string) => {
    setDefaultAddress(id);
    onRefresh();
  };

  return (
    <>
      <div className="block min-[601px]:hidden pb-36">
        <div className="flex items-center justify-between gap-3 bg-[var(--bj-bg)] px-4 py-3">
          <Link
            href="/order-summary"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <IconArrowLeft className="h-4 w-4 shrink-0" />
          </Link>
          <h1 className="text-center text-sm font-semibold text-[var(--bj-gold)]">{common.checkout.savedAddressesTitle}</h1>
          <span className="w-9 shrink-0" aria-hidden />
        </div>

        <CheckoutStepper current={2} />

        <div className="mt-5 space-y-4 px-4">
          <button
            type="button"
            onClick={onAddNew}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-100 py-3.5 text-sm font-semibold text-amber-950 shadow-sm ring-1 ring-amber-200/80 transition hover:bg-amber-200/80 active:scale-[0.99] dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-500/40 dark:hover:bg-amber-500/25"
          >
            <span className="relative inline-flex h-6 w-6 items-center justify-center text-amber-900 dark:text-amber-50">
              <IconMapPin className="h-5 w-5" />
              <IconPlus className="absolute -right-0.5 -top-0.5 h-3 w-3" />
            </span>
            {common.checkout.addNewAddress}
          </button>

          <div className="space-y-3">
            {entries.map((e) => (
              <div
                key={e.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCard(e.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    onSelectCard(e.id);
                  }
                }}
                className="relative cursor-pointer rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-stone-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <KindIcon kind={e.kind} />
                    <span className="text-sm font-semibold text-[var(--bj-gold)]">{kindTitle(e)}</span>
                    {e.isDefault ? (
                      <span className="rounded bg-[var(--bj-gold-fill)]/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                        {common.checkout.defaultBadge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {e.isDefault ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--bj-gold)] bg-[var(--bj-gold-fill)] text-[#1a1203]">
                        <IconCheck className="h-4 w-4" />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-full p-2 text-[var(--bj-gold)] hover:bg-stone-100 dark:hover:bg-zinc-800"
                      aria-label={replaceCopy(common.aria.editAddressKind, { kind: kindTitle(e) })}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEdit(e);
                      }}
                    >
                      <IconPencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-stone-900 dark:text-zinc-100">{e.fullName}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-zinc-400">{e.address}</p>
                <p className="mt-2 text-xs text-stone-500 dark:text-zinc-500">{e.phone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/80 bg-[var(--bj-bg)]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md dark:border-zinc-800/80">
          <div className="mx-auto w-full max-w-md">
            <Button className="w-full justify-center py-3.5 text-base" onClick={onPlaceOrder}>
              {common.checkout.placeOrder}
              <IconArrowRight className="h-5 w-5" />
            </Button>
            <p className="mt-3 text-center text-[10px] leading-snug text-stone-500 dark:text-zinc-500">
              {replaceCopy(common.checkout.defaultDeliveryFootnote, { siteName: SITE_NAME })}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden min-[601px]:block pb-10">
        <div className="mx-auto max-w-[1360px] pr-6 pt-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{common.checkout.savedAddressesTitle}</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">{common.desktop.finalize.pageSubtitle}</p>

          <div className="mt-8 grid grid-cols-1 items-start gap-6 min-[601px]:grid-cols-12 min-[601px]:gap-8">
            <div className={`${card} min-[601px]:col-span-5`}>
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                <IconMapPin className="h-4 w-4 shrink-0" />
                {common.checkout.savedAddressesTitle}
              </div>

              <button
                type="button"
                onClick={onAddNew}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 py-3 text-sm font-semibold text-amber-950 ring-1 ring-amber-200/80 transition hover:bg-amber-200/80 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-500/40 dark:hover:bg-amber-500/25"
              >
                <IconPlus className="h-4 w-4" />
                {common.checkout.addNewAddress}
              </button>

              <div className="space-y-3">
                {entries.map((e) => (
                  <div
                    key={e.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectCard(e.id)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        onSelectCard(e.id);
                      }
                    }}
                    className="relative cursor-pointer rounded-xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-stone-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <KindIcon kind={e.kind} />
                        <span className="text-sm font-semibold text-[var(--bj-gold)]">{kindTitle(e)}</span>
                        {e.isDefault ? (
                          <span className="rounded bg-[var(--bj-gold-fill)]/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                            {common.checkout.defaultBadge}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        {e.isDefault ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--bj-gold)] bg-[var(--bj-gold-fill)] text-[#1a1203]">
                            <IconCheck className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-full p-1.5 text-[var(--bj-gold)] hover:bg-stone-100 dark:hover:bg-zinc-800"
                          aria-label={replaceCopy(common.aria.editAddressKind, { kind: kindTitle(e) })}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onEdit(e);
                          }}
                        >
                          <IconPencil className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-stone-900 dark:text-zinc-100">{e.fullName}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-zinc-400">{e.address}</p>
                    <p className="mt-1.5 text-xs text-stone-500 dark:text-zinc-500">{e.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${card} min-[601px]:col-span-7 min-[601px]:sticky min-[601px]:top-28 min-[601px]:self-start`}>
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                <IconReceipt className="h-4 w-4 shrink-0" />
                {common.desktop.finalize.orderSummary}
              </div>
              <div className="min-[601px]:[&_section]:px-0">
                <SelectionList />
              </div>
              {lineCount > 0 ? (
                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-zinc-700">
                  <div className="flex justify-between text-stone-700 dark:text-zinc-300">
                    <span>{common.orderPlaced.subtotal}</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-700 dark:text-zinc-300">
                    <span>{common.orderPlaced.deliveryCharge}</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold dark:border-zinc-700">
                    <span className="text-stone-800 dark:text-zinc-200">{common.orderPlaced.totalAmount}</span>
                    <span className="text-[var(--bj-gold)]">₹{grandTotal}</span>
                  </div>
                </div>
              ) : null}
              <Button className="mt-6 w-full justify-center py-3.5 text-sm font-semibold" onClick={onPlaceOrder}>
                {common.checkout.placeOrder}
                <IconArrowRight className="h-5 w-5" />
              </Button>
              <p className="mt-3 text-center text-[10px] leading-snug text-stone-500 dark:text-zinc-500">
                {replaceCopy(common.checkout.defaultDeliveryFootnote, { siteName: SITE_NAME })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
