import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCartStore } from "@/features/cart/cart-store";
import { readOrderPlacedSnapshot } from "@/features/checkout/order-placed-snapshot";
import { useCommon } from "@/shared/data/common-copy-provider";
import { resolveAnimationSrc } from "@/shared/resolve-image-src";

const LOTTIE_SRC = "/animation/Success.lottie";

export function OrderPlacingWaitingScreen() {
  const common = useCommon();
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const navigatedRef = useRef(false);

  const goToPlaced = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    void router.replace("/order-placed");
  }, [router]);

  useEffect(() => {
    if (!readOrderPlacedSnapshot()) {
      void router.replace("/home");
      return;
    }
    const id = requestAnimationFrame(() => {
      clear();
    });
    return () => cancelAnimationFrame(id);
  }, [clear, router]);

  useEffect(() => {
    if (!dotLottie) return undefined;
    const onComplete = () => {
      goToPlaced();
    };
    dotLottie.addEventListener("complete", onComplete);
    return () => {
      dotLottie.removeEventListener("complete", onComplete);
    };
  }, [dotLottie, goToPlaced]);

  useEffect(() => {
    const tid = setTimeout(() => goToPlaced(), 8000);
    return () => clearTimeout(tid);
  }, [goToPlaced]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-[var(--bj-bg)] to-stone-100 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] dark:from-zinc-950 dark:via-[var(--bj-bg)] dark:to-zinc-950">
      <div className="relative flex h-[min(20rem,calc(100vw-2rem))] w-[min(20rem,calc(100vw-2rem))] shrink-0 items-center justify-center sm:h-80 sm:w-80">
        <DotLottieReact
          src={resolveAnimationSrc(LOTTIE_SRC)}
          loop={false}
          autoplay
          backgroundColor="transparent"
          dotLottieRefCallback={setDotLottie}
          layout={{ fit: "contain", align: [0.5, 0.5] }}
          className="relative h-full w-full"
          renderConfig={{ autoResize: true }}
        />
      </div>

      <p className="mt-8 text-center text-lg font-semibold text-stone-900 dark:text-zinc-100">
        {common.orderPlacing.confirmedTitle}
      </p>

      <p className="mt-2 text-center text-sm text-stone-600 dark:text-zinc-400">{common.orderPlacing.preparing}</p>

      <p className="mt-5 text-sm font-medium text-[var(--bj-gold)]">{common.orderPlacing.cod}</p>
    </div>
  );
}
