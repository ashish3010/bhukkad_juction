import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/features/cart/cart-store";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import {
  type DeliveryAddressKind,
  type SavedAddressEntry,
  upsertAddressFromForm,
} from "@/features/checkout/delivery-address-storage";
import { Button } from "@/shared/components/ui/Button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBriefcase,
  IconHome,
  IconIdCard,
  IconMap,
  IconMapPin,
  IconPhone,
} from "@/shared/components/icons";

const inputShell =
  "flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] px-3 py-3 text-left text-sm text-white placeholder:text-zinc-500 focus-within:border-[var(--bj-gold)]/40 focus-within:ring-1 focus-within:ring-[var(--bj-gold)]/20";

/** Strip non-digits; if value looks like 91 + 10 digits, keep the last 10. Cap at 10 digits for storage. */
function normalizePhoneDigits(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("91")) return d.slice(2, 12);
  return d.slice(0, 10);
}

type Props = {
  editingEntry: SavedAddressEntry | null;
  hasSavedAddresses: boolean;
  onCancel: () => void;
  onSaved: () => void;
};

export function DeliveryAddressForm({ editingEntry, hasSavedAddresses, onCancel, onSaved }: Props) {
  const router = useRouter();
  const { lines } = useCart();
  const [fullName, setFullName] = useState(() => editingEntry?.fullName ?? "");
  const [phone, setPhone] = useState(() => normalizePhoneDigits(editingEntry?.phone ?? ""));
  const [address, setAddress] = useState(() => editingEntry?.address ?? "");
  const [addressKind, setAddressKind] = useState<DeliveryAddressKind>(() => editingEntry?.kind ?? "home");
  const [otherLabel, setOtherLabel] = useState(() =>
    editingEntry?.kind === "other" ? (editingEntry.customLabel ?? "") : ""
  );

  const trimmedName = fullName.trim();
  const trimmedAddress = address.trim();
  const normalizedPhone = useMemo(() => (phone.length === 10 ? phone : null), [phone]);
  const canSave =
    trimmedName.length > 0 && trimmedAddress.length > 0 && normalizedPhone !== null;
  const phoneInvalid = phone.length > 0 && phone.length !== 10;

  useEffect(() => {
    if (lines.length === 0) {
      void router.replace("/order-summary");
    }
  }, [lines.length, router]);

  const onSaveAddress = () => {
    if (!fullName.trim() || !address.trim() || phone.length !== 10) return;
    const customLabel = addressKind === "other" ? otherLabel.trim() : undefined;
    upsertAddressFromForm({
      editingId: editingEntry?.id ?? null,
      kind: addressKind,
      customLabel,
      fullName: fullName.trim(),
      phone,
      address: address.trim(),
    });
    onSaved();
  };

  const backToSavedList = hasSavedAddresses || editingEntry !== null;

  return (
    <div className="pb-28">
      <div className="bg-[var(--bj-bg)] px-4 py-2.5">
        {backToSavedList ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            <IconArrowLeft className="h-4 w-4 shrink-0" />
            Saved addresses
          </button>
        ) : (
          <Link
            href="/order-summary"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            <IconArrowLeft className="h-4 w-4 shrink-0" />
            Back to cart
          </Link>
        )}
      </div>

      <CheckoutStepper current={2} />

      <div className="mt-6 space-y-8 px-4">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--bj-gold)]">Receiver Information</h2>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400" htmlFor="checkout-full-name">
              Full Name
            </label>
            <div className={inputShell}>
              <IconIdCard className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <input
                id="checkout-full-name"
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
                placeholder="Enter your full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400" htmlFor="checkout-phone">
              Contact Number
            </label>
            <div className={inputShell}>
              <IconPhone className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <input
                id="checkout-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(normalizePhoneDigits(e.target.value))}
              />
            </div>
            <p className="text-xs text-zinc-500">Digits only — 10-digit mobile number.</p>
            {phoneInvalid ? (
              <p className="text-xs text-[var(--bj-danger)]">Enter a valid 10-digit mobile number.</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--bj-gold)]">Delivery Address</h2>
          <div className="space-y-1.5">
            <label className="sr-only" htmlFor="checkout-address">
              Delivery address
            </label>
            <div className={`${inputShell} items-start`}>
              <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <textarea
                id="checkout-address"
                className="min-h-[100px] min-w-0 flex-1 resize-y bg-transparent text-white outline-none placeholder:text-zinc-500"
                placeholder="Flat / House No., Street Name, Landmark, City"
                rows={4}
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "home" as const, label: "Home", Icon: IconHome },
                { id: "work" as const, label: "Work", Icon: IconBriefcase },
                { id: "other" as const, label: "Other", Icon: IconMap },
              ] as const
            ).map(({ id, label, Icon }) => {
              const selected = addressKind === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAddressKind(id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    selected
                      ? "border-[var(--bj-gold)] bg-[var(--bj-gold)]/10 text-[var(--bj-gold)]"
                      : "border-white/15 bg-zinc-900/60 text-[var(--bj-gold)] hover:border-white/25"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {addressKind === "other" ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-400" htmlFor="checkout-other-label">
                Other label (optional)
              </label>
              <input
                id="checkout-other-label"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[var(--bj-gold)]/40 focus:ring-1 focus:ring-[var(--bj-gold)]/20"
                placeholder="e.g. Gym, parents home"
                value={otherLabel}
                onChange={(e) => setOtherLabel(e.target.value)}
              />
            </div>
          ) : null}
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[var(--bj-bg)]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <div className="mx-auto w-full max-w-md">
          <Button
            className="w-full justify-center py-3.5 text-base"
            disabled={!canSave}
            onClick={onSaveAddress}
          >
            Save & place order
            <IconArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-center text-[10px] leading-snug text-zinc-500">
            Saved on this device · The Bhukkad Junction
          </p>
        </div>
      </div>
    </div>
  );
}
