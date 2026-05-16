import { AppLogo } from "@/features/layout/components/AppLogo";

export function BrandMark() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-[var(--bj-gold)] bg-gradient-to-b from-[#2a2418] to-[#15120c] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <AppLogo width={88} className="rounded-full" priority />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/15" />
    </div>
  );
}
