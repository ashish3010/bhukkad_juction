import { useCallback, useMemo, useState } from "react";
import { useCart } from "@/features/cart/cart-store";
import type { PaymentMethodId } from "@/features/checkout/payment-method";
import {
  type DeliveryAddressKind,
  type SavedAddressEntry,
  upsertAddressFromForm,
} from "@/features/checkout/delivery-address-storage";
import { getProductById } from "@/shared/data/menu";

/** Strip non-digits; if value looks like 91 + 10 digits, keep the last 10. Cap at 10 digits for storage. */
export function normalizePhoneDigits(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("91")) return d.slice(2, 12);
  return d.slice(0, 10);
}

export function useDeliveryCheckoutForm(
  editingEntry: SavedAddressEntry | null,
) {
  const { lines } = useCart();
  const [fullName, setFullName] = useState(() => editingEntry?.fullName ?? "");
  const [phone, setPhone] = useState(() =>
    normalizePhoneDigits(editingEntry?.phone ?? ""),
  );
  const [address, setAddress] = useState(() => editingEntry?.address ?? "");
  const [addressKind, setAddressKind] = useState<DeliveryAddressKind>(
    () => editingEntry?.kind ?? "home",
  );
  const [otherLabel, setOtherLabel] = useState(() =>
    editingEntry?.kind === "other" ? (editingEntry.customLabel ?? "") : "",
  );
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("whatsapp");

  const trimmedName = fullName.trim();
  const trimmedAddress = address.trim();
  const normalizedPhone = useMemo(
    () => (phone.length === 10 ? phone : null),
    [phone],
  );
  const canSave =
    trimmedName.length > 0 &&
    trimmedAddress.length > 0 &&
    normalizedPhone !== null &&
    lines.length > 0;
  const phoneInvalid = phone.length > 0 && phone.length !== 10;

  const subtotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const p = getProductById(line.productId);
      return sum + (p ? p.price * line.quantity : 0);
    }, 0);
  }, [lines]);

  const setPhoneNormalized = useCallback((raw: string) => {
    setPhone(normalizePhoneDigits(raw));
  }, []);

  const persistIfValid = useCallback(():
    | { ok: true; orderNote?: string }
    | { ok: false } => {
    if (
      !fullName.trim() ||
      !address.trim() ||
      phone.length !== 10 ||
      lines.length === 0
    ) {
      return { ok: false };
    }
    const customLabel = addressKind === "other" ? otherLabel.trim() : undefined;
    upsertAddressFromForm({
      editingId: editingEntry?.id ?? null,
      kind: addressKind,
      customLabel,
      fullName: fullName.trim(),
      phone,
      address: address.trim(),
    });
    const note = orderNote.trim();
    return { ok: true, orderNote: note || undefined };
  }, [
    address,
    addressKind,
    editingEntry?.id,
    fullName,
    lines.length,
    orderNote,
    otherLabel,
    phone,
  ]);

  return {
    lines,
    fullName,
    setFullName,
    phone,
    setPhone: setPhoneNormalized,
    address,
    setAddress,
    addressKind,
    setAddressKind,
    otherLabel,
    setOtherLabel,
    orderNote,
    setOrderNote,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    canSave,
    phoneInvalid,
    persistIfValid,
  };
}
