export const ADDRESS_BOOK_STORAGE_KEY = "bj:address-book";

/** Legacy single-object key — migrated into the address book on read. */
const LEGACY_DELIVERY_KEY = "bj:delivery-address";

export type DeliveryAddressKind = "home" | "work" | "other";

export type SavedAddressEntry = {
  id: string;
  kind: DeliveryAddressKind;
  /** Shown when `kind` is `other`, e.g. "Gym" → "Other (Gym)" in the UI. */
  customLabel?: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

function isAddressKind(v: unknown): v is DeliveryAddressKind {
  return v === "home" || v === "work" || v === "other";
}

export function newAddressId(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeEntry(o: unknown): SavedAddressEntry | null {
  if (!o || typeof o !== "object") return null;
  const x = o as Record<string, unknown>;
  if (!isAddressKind(x.kind)) return null;
  const id = typeof x.id === "string" && x.id.length > 0 ? x.id : newAddressId();
  return {
    id,
    kind: x.kind,
    customLabel: typeof x.customLabel === "string" && x.customLabel.trim() ? String(x.customLabel).trim() : undefined,
    fullName: String(x.fullName ?? ""),
    phone: String(x.phone ?? ""),
    address: String(x.address ?? ""),
    isDefault: Boolean(x.isDefault),
  };
}

function ensureOneDefault(entries: SavedAddressEntry[]): SavedAddressEntry[] {
  if (entries.length === 0) return entries;
  const def = entries.find((e) => e.isDefault);
  if (!def) {
    return entries.map((e, i) => ({ ...e, isDefault: i === 0 }));
  }
  return entries.map((e) => ({ ...e, isDefault: e.id === def.id }));
}

export function loadAddressBook(): SavedAddressEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADDRESS_BOOK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const list = parsed.map(normalizeEntry).filter((e): e is SavedAddressEntry => e !== null);
        return ensureOneDefault(list);
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_DELIVERY_KEY);
    if (legacyRaw) {
      const data = JSON.parse(legacyRaw) as Record<string, unknown>;
      if (data && isAddressKind(data.addressKind)) {
        const entry: SavedAddressEntry = {
          id: newAddressId(),
          kind: data.addressKind,
          fullName: String(data.fullName ?? ""),
          phone: String(data.phone ?? ""),
          address: String(data.address ?? ""),
          isDefault: true,
        };
        persistAddressBook([entry]);
        localStorage.removeItem(LEGACY_DELIVERY_KEY);
        return [entry];
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function persistAddressBook(entries: SavedAddressEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADDRESS_BOOK_STORAGE_KEY, JSON.stringify(ensureOneDefault(entries)));
}

export function setDefaultAddress(id: string): void {
  const book = loadAddressBook().map((e) => ({ ...e, isDefault: e.id === id }));
  persistAddressBook(book);
}

export function upsertAddressFromForm(opts: {
  editingId: string | null;
  kind: DeliveryAddressKind;
  customLabel?: string;
  fullName: string;
  phone: string;
  address: string;
}): { book: SavedAddressEntry[] } {
  let book = loadAddressBook();
  const editing =
    opts.editingId && book.some((e) => e.id === opts.editingId) ? opts.editingId : null;

  if (editing) {
    book = book.map((e) =>
      e.id === editing
        ? {
            ...e,
            kind: opts.kind,
            customLabel: opts.customLabel?.trim() || undefined,
            fullName: opts.fullName.trim(),
            phone: opts.phone.trim(),
            address: opts.address.trim(),
          }
        : e
    );
    persistAddressBook(book);
    setDefaultAddress(editing);
    return { book: loadAddressBook() };
  }

  const entry: SavedAddressEntry = {
    id: newAddressId(),
    kind: opts.kind,
    customLabel: opts.customLabel?.trim() || undefined,
    fullName: opts.fullName.trim(),
    phone: opts.phone.trim(),
    address: opts.address.trim(),
    isDefault: true,
  };
  book = book.map((e) => ({ ...e, isDefault: false }));
  book = [...book, entry];
  persistAddressBook(book);
  return { book: loadAddressBook() };
}
