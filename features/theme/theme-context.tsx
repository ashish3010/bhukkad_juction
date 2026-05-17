import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const THEME_STORAGE_KEY = "bj:theme";

export type ThemeMode = "light" | "dark";

/** Reads the last saved theme from `localStorage` (`THEME_STORAGE_KEY`). */
export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/** Applies theme to the document and persists it under `THEME_STORAGE_KEY` in `localStorage`. */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", mode === "dark" ? "#121212" : "#f5f3ef");
  }
}

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Module-level snapshot so SSR + first client paint both read `"light"`; then we sync before paint. */
let themeSnapshot: ThemeMode = "light";
const themeListeners = new Set<() => void>();

function emitTheme() {
  themeListeners.forEach((l) => l());
}

function subscribeTheme(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  themeListeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY || e.storageArea !== localStorage) return;
    const v = e.newValue;
    if (v === "dark" || v === "light") {
      themeSnapshot = v;
      applyTheme(v);
      emitTheme();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    themeListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot(): ThemeMode {
  return themeSnapshot;
}

function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

function readResolvedTheme(): ThemeMode {
  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === "dark" || fromDom === "light") return fromDom;
  return getStoredTheme();
}

/** Keeps `theme` in sync with `localStorage` and restores it on reload (see inline script in `_app.tsx`). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  useLayoutEffect(() => {
    const resolved = readResolvedTheme();
    if (resolved === themeSnapshot) {
      applyTheme(resolved);
      return;
    }
    themeSnapshot = resolved;
    applyTheme(resolved);
    emitTheme();
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    themeSnapshot = mode;
    applyTheme(mode);
    emitTheme();
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
