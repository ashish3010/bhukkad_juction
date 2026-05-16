import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/features/landing/components/BrandMark";
import { GetStartedButton } from "@/features/landing/components/GetStartedButton";
import { LiveKitchenBadge } from "@/features/landing/components/LiveKitchenBadge";

export function LandingScreen() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/landing-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80" />
      </div>

      <LiveKitchenBadge />

      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-10 pt-[max(4.5rem,env(safe-area-inset-top))]">
        <BrandMark />

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#f5d78e] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl">
            The Bhukkad Junction
          </h1>
          <p className="mt-2 text-xl font-bold text-[#f5d78e] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
            Khane ka Asli Junction!
          </p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Experience the authentic flavors of Bihar, delivered from our kitchen to your doorstep in Gurgaon (Gurugram).
          </p>
        </div>

        <div className="mt-auto w-full space-y-5 pt-14">
          <GetStartedButton />
          <p className="text-center text-sm text-white/85">
            Already a member?{" "}
            <Link href="/home" className="font-semibold text-[#f5d78e] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
