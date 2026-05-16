import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/features/landing/components/BrandMark";
import { GetStartedButton } from "@/features/landing/components/GetStartedButton";
import { LiveKitchenBadge } from "@/features/landing/components/LiveKitchenBadge";

export function LandingScreen() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[var(--bj-bg)] text-stone-900 dark:text-zinc-100">
      <div className="relative h-[38vh] min-h-[200px] w-full shrink-0">
        <Image
          src="/images/landing-hero.png"
          alt=""
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
          <h1 className="text-3xl font-bold tracking-tight text-[var(--bj-gold)] sm:text-4xl">
            The Bhukkad Junction
          </h1>
          <p className="mt-2 text-xl font-bold text-[var(--bj-gold)]">Khane ka Asli Junction!</p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
            Experience the authentic flavors of Bihar, delivered from our kitchen to your doorstep in Gurgaon (Gurugram).
          </p>
        </div>

        <div className="mt-auto w-full space-y-5 pt-12">
          <GetStartedButton />
          <p className="text-center text-sm text-stone-600 dark:text-zinc-400">
            Already a member?{" "}
            <Link href="/home" className="font-semibold text-[var(--bj-gold)] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
