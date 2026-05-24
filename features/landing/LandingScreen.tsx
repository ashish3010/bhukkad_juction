import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/features/landing/components/BrandMark";
import { GetStartedButton } from "@/features/landing/components/GetStartedButton";
import { LiveKitchenBadge } from "@/features/landing/components/LiveKitchenBadge";
import { useCommon } from "@/shared/data/common-copy-provider";
import { resolveImageSrc } from "@/shared/resolve-image-src";

export function LandingScreen() {
  const common = useCommon();
  const l = common.landing;
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[var(--bj-bg)] text-stone-900 dark:text-zinc-100">
      <div className="relative h-[38vh] min-h-[200px] w-full shrink-0">
        <Image
          src={resolveImageSrc("/images/landing-hero.png")}
          alt={l.heroImageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/25 via-transparent to-[var(--bj-bg)]" />
        <LiveKitchenBadge />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-10 pt-2">
        <BrandMark />

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--bj-gold)] sm:text-4xl">{l.title}</h1>
          <p className="mt-2 text-xl font-bold text-[var(--bj-gold)]">{l.tagline}</p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-stone-600 dark:text-zinc-400">{l.description}</p>
        </div>

        <div className="mt-auto w-full space-y-5 pt-12">
          <GetStartedButton />
          <p className="text-center text-sm text-stone-600 dark:text-zinc-400">
            {l.alreadyMember}{" "}
            <Link href="/home" className="font-semibold text-[var(--bj-gold)] hover:underline">
              {l.logIn}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
