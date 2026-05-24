import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/features/cart/cart-store";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { DesktopFinalizeCheckoutView } from "@/features/checkout/DesktopFinalizeCheckoutView";
import { useDeliveryCheckoutForm } from "@/features/checkout/use-delivery-checkout-form";
import { Button } from "@/shared/components/ui/Button";
import { useCommon } from "@/shared/data/common-copy-provider";
import { replaceCopy } from "@/shared/data/common";
import { SITE_NAME } from "@/shared/site-meta";
import {
  type SavedAddressEntry,
} from "@/features/checkout/delivery-address-storage";
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
  "flex w-full items-start gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-3 text-left text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus-within:border-[var(--bj-gold)]/50 focus-within:ring-1 focus-within:ring-[var(--bj-gold-fill)]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

type Props = {
  editingEntry: SavedAddressEntry | null;
  hasSavedAddresses: boolean;
  onCancel: () => void;
  onSaved: (orderNote?: string) => void;
  hidePaymentAndCouponOnDesktop?: boolean;
  /** Desktop finalize “Edit cart” target (default `/order-summary`). */
  editCartHref?: string;
};

export function DeliveryAddressForm({
  editingEntry,
  hasSavedAddresses,
  onCancel,
  onSaved,
  hidePaymentAndCouponOnDesktop = false,
  editCartHref = "/order-summary",
}: Props) {
  const common = useCommon();
  const router = useRouter();
  const { lines } = useCart();
  const c = common.checkout;
  const form = useDeliveryCheckoutForm(editingEntry);

  useEffect(() => {
    if (lines.length === 0) {
      void router.replace("/order-summary");
    }
  }, [lines.length, router]);

  const onSaveAddress = () => {
    const r = form.persistIfValid();
    if (r.ok) onSaved(r.orderNote);
  };

  const backToSavedList = hasSavedAddresses || editingEntry !== null;

  return (
    <>
      <div className="block min-[601px]:hidden">
        <div className="pb-28">
          <div className="bg-[var(--bj-bg)] px-4 py-2.5">
            {backToSavedList ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                {c.savedAddressesBack}
              </button>
            ) : (
              <Link
                href="/order-summary"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                {c.backToCart}
              </Link>
            )}
          </div>

          <CheckoutStepper current={2} />

          <div className="mt-6 space-y-8 px-4">
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--bj-gold)]">{c.receiverInfo}</h2>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400" htmlFor="checkout-full-name">
                  {c.fullName}
                </label>
                <div className={inputShell}>
                  <IconIdCard className="mt-0.5 h-5 w-5 shrink-0 text-stone-400 dark:text-zinc-500" />
                  <input
                    id="checkout-full-name"
                    className="min-w-0 flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    placeholder={c.fullNamePlaceholder}
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => form.setFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400" htmlFor="checkout-phone">
                  {c.contactNumber}
                </label>
                <div className={inputShell}>
                  <IconPhone className="mt-0.5 h-5 w-5 shrink-0 text-stone-400 dark:text-zinc-500" />
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    className="min-w-0 flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    placeholder={c.phonePlaceholder}
                    value={form.phone}
                    onChange={(e) => form.setPhone(e.target.value)}
                  />
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-500">{c.phoneHint}</p>
                {form.phoneInvalid ? (
                  <p className="text-xs text-[var(--bj-danger)]">{c.phoneInvalid}</p>
                ) : null}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--bj-gold)]">{c.deliveryAddress}</h2>
              <div className="space-y-1.5">
                <label className="sr-only" htmlFor="checkout-address">
                  {c.deliveryAddressSr}
                </label>
                <div className={`${inputShell} items-start`}>
                  <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone-400 dark:text-zinc-500" />
                  <textarea
                    id="checkout-address"
                    className="min-h-[100px] min-w-0 flex-1 resize-y bg-transparent text-stone-900 outline-none placeholder:text-stone-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    placeholder={c.addressPlaceholder}
                    rows={4}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => form.setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "home" as const, label: c.addressKindHome, Icon: IconHome },
                    { id: "work" as const, label: c.addressKindWork, Icon: IconBriefcase },
                    { id: "other" as const, label: c.addressKindOther, Icon: IconMap },
                  ] as const
                ).map(({ id, label, Icon }) => {
                  const selected = form.addressKind === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => form.setAddressKind(id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        selected
                          ? "border-[var(--bj-gold)] bg-[var(--bj-gold-fill)]/20 text-[var(--bj-gold)]"
                          : "border-stone-200 bg-stone-100 text-[var(--bj-gold)] hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {form.addressKind === "other" ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400" htmlFor="checkout-other-label">
                    {c.otherLabel}
                  </label>
                  <input
                    id="checkout-other-label"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none placeholder:text-stone-400 focus:border-[var(--bj-gold)]/50 focus:ring-1 focus:ring-[var(--bj-gold-fill)]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    placeholder={c.otherLabelPlaceholder}
                    value={form.otherLabel}
                    onChange={(e) => form.setOtherLabel(e.target.value)}
                  />
                </div>
              ) : null}
            </section>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/80 bg-[var(--bj-bg)]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md dark:border-zinc-800/80 min-[601px]:hidden">
            <div className="mx-auto w-full max-w-md">
              <Button
                className="w-full justify-center py-3.5 text-base"
                disabled={!form.canSave}
                onClick={onSaveAddress}
              >
                {c.saveAndPlaceOrder}
                <IconArrowRight className="h-5 w-5" />
              </Button>
              <p className="mt-3 text-center text-[10px] leading-snug text-stone-500 dark:text-zinc-500">
                {replaceCopy(c.savedOnDeviceNote, { siteName: SITE_NAME })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-[601px]:block">
        <DesktopFinalizeCheckoutView
          subtotal={form.subtotal}
          fullName={form.fullName}
          onFullNameChange={form.setFullName}
          phone={form.phone}
          onPhoneChange={form.setPhone}
          address={form.address}
          onAddressChange={form.setAddress}
          addressKind={form.addressKind}
          onAddressKindChange={form.setAddressKind}
          otherLabel={form.otherLabel}
          onOtherLabelChange={form.setOtherLabel}
          orderNote={form.orderNote}
          onOrderNoteChange={form.setOrderNote}
          phoneInvalid={form.phoneInvalid}
          canSave={form.canSave}
          onSave={onSaveAddress}
          paymentMethod={form.paymentMethod}
          onPaymentMethodChange={form.setPaymentMethod}
          editCartHref={editCartHref}
          hidePaymentAndCoupon={hidePaymentAndCouponOnDesktop}
        />
      </div>
    </>
  );
}
