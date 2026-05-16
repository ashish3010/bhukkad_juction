import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";

export function PromoHero() {
  return (
    <div className="px-4 pb-6 pt-2">
      <div className="relative overflow-hidden rounded-3xl ring-1 ring-stone-200 shadow-sm dark:ring-zinc-800">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/images/landing-hero.png"
            alt="Litti Chokha"
            fill
            className="object-cover"
            sizes="(max-width:448px) 100vw, 448px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/75 via-stone-900/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-5">
            <h2 className="text-2xl font-bold text-white">Authentic Litti Chokha</h2>
            <p className="max-w-sm text-sm text-white/90">
              Home Food, Hygienic &amp; Comfort Food, Made with Love
            </p>
            <Link href="/home#menu-authentic-litti">
              <Button className="px-6 py-2.5 text-sm">Order Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
