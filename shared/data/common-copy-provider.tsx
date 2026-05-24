"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isLocalPublicJsonMode } from "@/shared/data/local-json-mode";
import { commonLocal, type CommonCopy } from "./common";
import {
  remoteCommonFetchUrls,
  STATIC_COMMON_URL,
} from "@/shared/data/site-json-endpoints";
import { isValidCommonPayload } from "@/shared/data/site-json-payload";

const CommonCopyContext = createContext<CommonCopy>(commonLocal);

export function CommonCopyProvider({
  children,
  initialCommon,
}: {
  children: ReactNode;
  /** From `_app.getInitialProps` / SSR; when valid, skips client refetch. */
  initialCommon?: CommonCopy | null;
}) {
  const ssrCommon = initialCommon != null && isValidCommonPayload(initialCommon) ? initialCommon : null;
  const skipClientFetch = ssrCommon != null;
  const [copy, setCopy] = useState<CommonCopy>(() => ssrCommon ?? commonLocal);

  useEffect(() => {
    if (skipClientFetch) return undefined;

    let cancelled = false;

    const apply = (data: unknown) => {
      if (cancelled || !isValidCommonPayload(data)) return false;
      setCopy(data);
      return true;
    };

    void (async () => {
      if (isLocalPublicJsonMode()) {
        try {
          const res = await fetch(STATIC_COMMON_URL, { cache: "no-store" });
          if (res.ok) {
            const json: unknown = await res.json();
            if (apply(json)) return;
          }
        } catch {
          /* keep bundled commonLocal */
        }
        return;
      }

      for (const url of remoteCommonFetchUrls()) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const json: unknown = await res.json();
            if (apply(json)) return;
          }
        } catch {
          /* try next URL */
        }
      }
      try {
        const res = await fetch(STATIC_COMMON_URL, { cache: "no-store" });
        if (res.ok) {
          const json: unknown = await res.json();
          if (apply(json)) return;
        }
      } catch {
        /* keep bundled commonLocal */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [skipClientFetch]);

  return <CommonCopyContext.Provider value={copy}>{children}</CommonCopyContext.Provider>;
}

export function useCommon(): CommonCopy {
  return useContext(CommonCopyContext);
}
