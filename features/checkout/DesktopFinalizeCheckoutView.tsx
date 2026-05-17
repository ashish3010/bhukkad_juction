import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { DeliveryAddressKind } from "@/features/checkout/delivery-address-storage";
import { CheckoutOrderLinesCompact } from "@/features/checkout/components/CheckoutOrderLinesCompact";
import { Button } from "@/shared/components/ui/Button";
import {
  IconBriefcase,
  IconCashOutline,
  IconCheck,
  IconCreditCardOutline,
  IconHome,
  IconIdCard,
  IconLock,
  IconMap,
  IconMapPin,
  IconPhone,
  IconReceipt,
  IconWallet,
  IconWhatsApp,
} from "@/shared/components/icons";
import { common, replaceCopy } from "@/shared/data/common";
import { SITE_NAME } from "@/shared/site-meta";
import { useCartStore } from "@/features/cart/cart-store";

import type { PaymentMethodId } from "@/features/checkout/payment-method";
const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-[var(--bj-gold)]/50 focus:ring-1 focus:ring-[var(--bj-gold-fill)]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

const textareaClass =
  "min-h-[88px] w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-[var(--bj-gold)]/50 focus:ring-1 focus:ring-[var(--bj-gold-fill)]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

type Props = {
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  fullName: string;
  onFullNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  address: string;
  onAddressChange: (v: string) => void;
  addressKind: DeliveryAddressKind;
  onAddressKindChange: (k: DeliveryAddressKind) => void;
  otherLabel: string;
  onOtherLabelChange: (v: string) => void;
  orderNote: string;
  onOrderNoteChange: (v: string) => void;
  phoneInvalid: boolean;
  canSave: boolean;
  onSave: () => void;
  paymentMethod: PaymentMethodId;
  onPaymentMethodChange: (id: PaymentMethodId) => void;
  /** Cart edit link target (default `/order-summary`). */
  editCartHref?: string;
  /** Order-summary desktop: no payment column, no coupon row; CTA lives in the summary card. */
  hidePaymentAndCoupon?: boolean;
};

const card =
  "rounded-2xl border border-stone-200/80 bg-[var(--bj-card)] p-5 shadow-sm dark:border-zinc-800/80 dark:shadow-none";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <Icon className="h-5 w-5 shrink-0 text-[var(--bj-gold-fill)]" />
      <span className="text-base font-bold tracking-tight text-stone-900 dark:text-zinc-50">
        {children}
      </span>
    </div>
  );
}

export function DesktopFinalizeCheckoutView({
  subtotal,
  deliveryFee,
  grandTotal,
  fullName,
  onFullNameChange,
  phone,
  onPhoneChange,
  address,
  onAddressChange,
  addressKind,
  onAddressKindChange,
  otherLabel,
  onOtherLabelChange,
  orderNote,
  onOrderNoteChange,
  phoneInvalid,
  canSave,
  onSave,
  paymentMethod,
  onPaymentMethodChange,
  editCartHref = "/order-summary",
  hidePaymentAndCoupon = false,
}: Props) {
  const f = common.desktop.finalize;
  const c = common.checkout;
  const lineCount = useCartStore((s) => s.lines.length);

  const kindChips = (
    [
      { id: "home" as const, label: c.addressKindHome, Icon: IconHome },
      { id: "work" as const, label: c.addressKindWork, Icon: IconBriefcase },
      { id: "other" as const, label: c.addressKindOther, Icon: IconMap },
    ] as const
  ).map(({ id, label, Icon }) => {
    const selected = addressKind === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onAddressKindChange(id)}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          selected
            ? "border-[var(--bj-gold)] bg-[var(--bj-gold-fill)]/20 text-[var(--bj-gold)]"
            : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  });

  const paymentOption = (
    id: PaymentMethodId,
    title: string,
    subtitle: string,
    Icon: ComponentType<{ className?: string }>,
  ) => {
    const active = paymentMethod === id;
    const disabled = id !== "whatsapp";
    return (
      <button
        key={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) onPaymentMethodChange(id);
        }}
        className={`relative flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
          disabled
            ? "cursor-not-allowed border-stone-200/80 opacity-60 dark:border-zinc-800/80"
            : active
              ? "border-[var(--bj-gold-fill)] bg-[var(--bj-gold-fill)]/10 shadow-sm dark:border-[var(--bj-gold-fill)]"
              : "border-stone-200 hover:border-stone-300 dark:border-zinc-700 dark:hover:border-zinc-600"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-800 dark:bg-zinc-800 dark:text-zinc-100">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-stone-900 dark:text-zinc-100">
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-stone-500 dark:text-zinc-500">
            {subtitle}
          </span>
          {disabled ? (
            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-stone-400 dark:text-zinc-600">
              {f.paymentComingSoon}
            </span>
          ) : null}
        </span>
        {active && !disabled ? (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bj-gold-fill)] text-[#1a1203]">
            <IconCheck className="h-3.5 w-3.5" />
          </span>
        ) : !active && !disabled ? (
          <span
            className="absolute right-2 top-2 h-5 w-5 rounded-full border-2 border-stone-300 dark:border-zinc-600"
            aria-hidden
          />
        ) : (
          <span
            className="absolute right-2 top-2 h-5 w-5 rounded-full border-2 border-stone-200 dark:border-zinc-700"
            aria-hidden
          />
        )}
      </button>
    );
  };

  return (
    <div className="pb-10">
      <div className="mx-auto max-w-[1360px] pr-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          {f.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-zinc-400">
          {f.pageSubtitle}
        </p>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 min-[601px]:grid-cols-12 min-[601px]:gap-6">
          {/* 1 — Delivery details */}
          <div
            className={`${card} ${hidePaymentAndCoupon ? "min-[601px]:col-span-6" : "min-[601px]:col-span-4"}`}
          >
            <SectionTitle icon={IconMapPin}>{f.deliveryDetails}</SectionTitle>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium text-stone-500 dark:text-zinc-400"
                  htmlFor="desk-full-name"
                >
                  {c.fullName}
                </label>
                <div className="relative">
                  <IconIdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
                  <input
                    id="desk-full-name"
                    className={`${inputClass} pl-10`}
                    placeholder={c.fullNamePlaceholder}
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium text-stone-500 dark:text-zinc-400"
                  htmlFor="desk-phone"
                >
                  {c.contactNumber}
                </label>
                <div className="relative">
                  <IconPhone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
                  <input
                    id="desk-phone"
                    type="tel"
                    inputMode="numeric"
                    className={`${inputClass} pl-10`}
                    placeholder={c.phonePlaceholder}
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                  />
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-500">
                  {c.phoneHint}
                </p>
                {phoneInvalid ? (
                  <p className="text-xs text-[var(--bj-danger)]">
                    {c.phoneInvalid}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium text-stone-500 dark:text-zinc-400"
                  htmlFor="desk-address"
                >
                  {c.deliveryAddress}
                </label>
                <div className="relative">
                  <IconMapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-stone-400 dark:text-zinc-500" />
                  <textarea
                    id="desk-address"
                    className={`${textareaClass} pl-10`}
                    placeholder={c.addressPlaceholder}
                    rows={4}
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">{kindChips}</div>
              {addressKind === "other" ? (
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-medium text-stone-500 dark:text-zinc-400"
                    htmlFor="desk-other"
                  >
                    {c.otherLabel}
                  </label>
                  <input
                    id="desk-other"
                    className={inputClass}
                    placeholder={c.otherLabelPlaceholder}
                    value={otherLabel}
                    onChange={(e) => onOtherLabelChange(e.target.value)}
                  />
                </div>
              ) : null}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium text-stone-500 dark:text-zinc-400"
                  htmlFor="desk-note"
                >
                  {c.orderNoteOptional}
                </label>
                <textarea
                  id="desk-note"
                  className={textareaClass}
                  placeholder={c.orderNotePlaceholder}
                  rows={3}
                  value={orderNote}
                  onChange={(e) => onOrderNoteChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {!hidePaymentAndCoupon ? (
            <div className={`${card} flex flex-col min-[601px]:col-span-4`}>
              <SectionTitle icon={IconWallet}>{f.paymentMethod}</SectionTitle>
              <div className="space-y-2">
                {paymentOption(
                  "whatsapp",
                  f.payWhatsappTitle,
                  f.payWhatsappSubtitle,
                  IconWhatsApp,
                )}
                {paymentOption(
                  "card",
                  f.payCardTitle,
                  f.payCardSubtitle,
                  IconCreditCardOutline,
                )}
                {paymentOption(
                  "cod",
                  f.payCodTitle,
                  f.payCodSubtitle,
                  IconCashOutline,
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-500">
                <IconLock className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-zinc-500" />
                {f.secureNote}
              </div>
              <Button
                type="button"
                className="mt-6 w-full justify-center py-3.5 text-sm font-semibold"
                disabled={!canSave || paymentMethod !== "whatsapp"}
                onClick={onSave}
              >
                {f.proceedWhatsapp}
              </Button>
              <p className="mt-3 text-center text-[10px] leading-snug text-stone-500 dark:text-zinc-500">
                {replaceCopy(c.savedOnDeviceNote, { siteName: SITE_NAME })}
              </p>
            </div>
          ) : null}

          {/* 3 — Order summary */}
          <div
            className={`${card} min-[601px]:sticky min-[601px]:top-28 min-[601px]:self-start ${
              hidePaymentAndCoupon
                ? "min-[601px]:col-span-6"
                : "min-[601px]:col-span-4"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <IconReceipt className="h-5 w-5 shrink-0 text-[var(--bj-gold-fill)]" />
                <span className="text-base font-bold tracking-tight text-stone-900 dark:text-zinc-50">
                  {f.orderSummary}
                </span>
              </div>
              <Link
                href={editCartHref}
                className="shrink-0 text-xs font-semibold text-[var(--bj-gold)] hover:underline"
              >
                {f.editCart}
              </Link>
            </div>
            <CheckoutOrderLinesCompact />
            {lineCount > 0 ? (
              <>
                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-zinc-700">
                  <div className="flex justify-between text-stone-700 dark:text-zinc-300">
                    <span>{common.orderPlaced.subtotal}</span>
                    <span className="tabular-nums">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-700 dark:text-zinc-300">
                    <span>{common.orderPlaced.deliveryCharge}</span>
                    <span className="tabular-nums">₹{deliveryFee}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-stone-200 pt-4 dark:border-zinc-700">
                  <span className="text-sm font-medium text-stone-800 dark:text-zinc-300">
                    {common.orderPlaced.totalAmount}
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-[var(--bj-gold)]">
                    ₹{grandTotal}
                  </span>
                </div>
                {!hidePaymentAndCoupon ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      readOnly
                      placeholder={f.couponCode}
                      className={`${inputClass} flex-1 cursor-not-allowed opacity-70`}
                      title={f.couponHint}
                    />
                    <button
                      type="button"
                      disabled
                      title={f.couponHint}
                      className="shrink-0 rounded-xl border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
                    >
                      {f.couponApply}
                    </button>
                  </div>
                ) : null}
                {hidePaymentAndCoupon ? (
                  <>
                    <Button
                      type="button"
                      className="mt-5 w-full justify-center py-3.5 text-sm font-semibold"
                      disabled={!canSave}
                      onClick={onSave}
                    >
                      {c.saveAndPlaceOrder}
                    </Button>
                    <p className="mt-3 text-center text-[10px] leading-snug text-stone-500 dark:text-zinc-500">
                      {replaceCopy(c.savedOnDeviceNote, {
                        siteName: SITE_NAME,
                      })}
                    </p>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
