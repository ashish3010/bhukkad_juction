import Link from "next/link";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { setDefaultAddress, type SavedAddressEntry } from "@/features/checkout/delivery-address-storage";
import { Button } from "@/shared/components/ui/Button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBriefcase,
  IconCheck,
  IconHome,
  IconMapPin,
  IconPencil,
  IconPlus,
} from "@/shared/components/icons";

type Props = {
  entries: SavedAddressEntry[];
  onRefresh: () => void;
  onAddNew: () => void;
  onEdit: (entry: SavedAddressEntry) => void;
  onPlaceOrder: () => void;
};

function kindTitle(e: SavedAddressEntry): string {
  if (e.kind === "home") return "Home";
  if (e.kind === "work") return "Work";
  return e.customLabel ? `Other (${e.customLabel})` : "Other";
}

function KindIcon({ kind }: { kind: SavedAddressEntry["kind"] }) {
  if (kind === "home") return <IconHome className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
  if (kind === "work") return <IconBriefcase className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
  return <IconMapPin className="h-4 w-4 shrink-0 text-[var(--bj-gold)]" />;
}

export function SavedAddressesScreen({ entries, onRefresh, onAddNew, onEdit, onPlaceOrder }: Props) {
  const onSelectCard = (id: string) => {
    setDefaultAddress(id);
    onRefresh();
  };

  return (
    <div className="pb-36">
      <div className="flex items-center justify-between gap-3 bg-[var(--bj-bg)] px-4 py-3">
        <Link
          href="/order-summary"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          <IconArrowLeft className="h-4 w-4 shrink-0" />
        </Link>
        <h1 className="text-center text-sm font-semibold text-[var(--bj-gold)]">Saved Addresses</h1>
        <span className="w-9 shrink-0" aria-hidden />
      </div>

      <CheckoutStepper current={2} />

      <div className="mt-5 space-y-4 px-4">
        <button
          type="button"
          onClick={onAddNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f5e6c8] py-3.5 text-sm font-semibold text-[#6b5414] shadow-inner ring-1 ring-black/5 transition hover:brightness-95 active:scale-[0.99]"
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center text-[#6b5414]">
            <IconMapPin className="h-5 w-5" />
            <IconPlus className="absolute -right-0.5 -top-0.5 h-3 w-3" />
          </span>
          Add New Address
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
              className="relative cursor-pointer rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 text-left transition hover:border-white/15"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <KindIcon kind={e.kind} />
                  <span className="text-sm font-semibold text-[var(--bj-gold)]">{kindTitle(e)}</span>
                  {e.isDefault ? (
                    <span className="rounded bg-[var(--bj-gold)]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                      Default
                    </span>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  {e.isDefault ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--bj-gold)] bg-[var(--bj-gold)] text-[#1a1203]">
                      <IconCheck className="h-4 w-4" />
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-full p-2 text-[var(--bj-gold)] hover:bg-white/5"
                    aria-label={`Edit ${kindTitle(e)}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onEdit(e);
                    }}
                  >
                    <IconPencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-white">{e.fullName}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{e.address}</p>
              <p className="mt-2 text-xs text-zinc-500">{e.phone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[var(--bj-bg)]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <div className="mx-auto w-full max-w-md">
          <Button className="w-full justify-center py-3.5 text-base" onClick={onPlaceOrder}>
            Place order
            <IconArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-center text-[10px] leading-snug text-zinc-500">
            Default address is used for delivery · The Bhukkad Junction
          </p>
        </div>
      </div>
    </div>
  );
}
