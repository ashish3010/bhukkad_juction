import { AppLogo } from "@/features/layout/components/AppLogo";

export function BrandMark() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-[var(--bj-gold)] bg-gradient-to-b from-amber-50 to-amber-100/90 shadow-[0_12px_32px_rgba(146,64,14,0.12)] dark:from-zinc-800 dark:to-zinc-950 dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
      <AppLogo width={88} circleCrop priority />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-stone-200/80 dark:ring-zinc-600/80" />
    </div>
  );
}
