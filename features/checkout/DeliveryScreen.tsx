import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/features/cart/cart-store";
import { DeliveryAddressForm } from "@/features/checkout/DeliveryAddressForm";
import { loadAddressBook, type SavedAddressEntry } from "@/features/checkout/delivery-address-storage";
import { writeOrderPlacedSnapshot } from "@/features/checkout/order-placed-snapshot";
import { SavedAddressesScreen } from "@/features/checkout/SavedAddressesScreen";

type Phase = "checking" | "list" | "form";

export function DeliveryScreen() {
  const router = useRouter();
  const { lines } = useCart();
  const [phase, setPhase] = useState<Phase>("checking");
  const [book, setBook] = useState<SavedAddressEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<SavedAddressEntry | null>(null);

  const refreshBook = useCallback(() => {
    setBook(loadAddressBook());
  }, []);

  useEffect(() => {
    if (lines.length === 0) {
      void router.replace("/order-summary");
    }
  }, [lines.length, router]);

  useEffect(() => {
    if (lines.length === 0) return;
    const entries = loadAddressBook();
    /* eslint-disable react-hooks/set-state-in-effect -- bootstrap checkout phase from localStorage once cart has items */
    setBook(entries);
    setPhase(entries.length > 0 ? "list" : "form");
    setEditingEntry(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [lines.length]);

  const goFormNew = useCallback(() => {
    setEditingEntry(null);
    setPhase("form");
  }, []);

  const goFormEdit = useCallback((entry: SavedAddressEntry) => {
    setEditingEntry(entry);
    setPhase("form");
  }, []);

  const onFormCancel = useCallback(() => {
    const entries = loadAddressBook();
    if (entries.length > 0) {
      refreshBook();
      setEditingEntry(null);
      setPhase("list");
    } else {
      void router.push("/order-summary");
    }
  }, [refreshBook, router]);

  const onPlaceOrder = useCallback(async () => {
    const snap = writeOrderPlacedSnapshot(lines);
    if (!snap) return;
    try {
      await fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snap),
      });
    } catch {
      /* Telegram/network failure — order snapshot is already saved; flow continues */
    }
    void router.push("/order-placing");
  }, [lines, router]);

  const onFormSaved = useCallback(async () => {
    refreshBook();
    setEditingEntry(null);
    const snap = writeOrderPlacedSnapshot(lines);
    if (!snap) return;
    try {
      await fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snap),
      });
    } catch {
      /* same as onPlaceOrder */
    }
    void router.push("/order-placing");
  }, [lines, refreshBook, router]);

  if (phase === "checking") {
    return <div className="min-h-[40vh] bg-[var(--bj-bg)]" aria-hidden />;
  }

  if (phase === "list") {
    return (
      <SavedAddressesScreen
        entries={book}
        onRefresh={refreshBook}
        onAddNew={goFormNew}
        onEdit={goFormEdit}
        onPlaceOrder={onPlaceOrder}
      />
    );
  }

  return (
    <DeliveryAddressForm
      key={editingEntry?.id ?? "new"}
      editingEntry={editingEntry}
      hasSavedAddresses={book.length > 0}
      onCancel={onFormCancel}
      onSaved={onFormSaved}
    />
  );
}
