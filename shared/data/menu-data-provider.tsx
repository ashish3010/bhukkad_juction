"use client";

import { useEffect, type ReactNode } from "react";
import { useMenuStore } from "@/shared/data/menu";
import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";
import {
  remoteMenuFetchUrls,
  STATIC_MENU_URL,
} from "@/shared/data/site-json-endpoints";
import { isValidMenuPayload, type SiteMenuPayload } from "@/shared/data/site-json-payload";

export function MenuDataProvider({
  children,
  initialMenu,
}: {
  children: ReactNode;
  /** From `_app.getInitialProps` / SSR; when valid, hydrates the store and skips client refetch. */
  initialMenu?: SiteMenuPayload | null;
}) {
  const hasSsrMenu = initialMenu != null && isValidMenuPayload(initialMenu);
  if (hasSsrMenu) {
    useMenuStore.setState({
      categories: initialMenu.categories,
      products: initialMenu.products,
    });
  }

  useEffect(() => {
    if (hasSsrMenu) return undefined;

    let cancelled = false;

    const apply = (data: unknown) => {
      if (cancelled || !isValidMenuPayload(data)) return false;
      useMenuStore.setState({ categories: data.categories, products: data.products });
      return true;
    };

    void (async () => {
      if (isLocalPublicJsonMode()) {
        try {
          const res = await fetch(STATIC_MENU_URL, { cache: "default" });
          if (res.ok) {
            const json: unknown = await res.json();
            if (apply(json)) return;
          }
        } catch {
          /* keep bundled menu */
        }
        return;
      }

      for (const url of remoteMenuFetchUrls()) {
        try {
          const res = await fetch(url, { cache: "default" });
          if (res.ok) {
            const json: unknown = await res.json();
            if (apply(json)) return;
          }
        } catch {
          /* try next URL */
        }
      }
      try {
        const res = await fetch(STATIC_MENU_URL, { cache: "default" });
        if (res.ok) {
          const json: unknown = await res.json();
          if (apply(json)) return;
        }
      } catch {
        /* keep bundled menu */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasSsrMenu]);

  return children;
}
