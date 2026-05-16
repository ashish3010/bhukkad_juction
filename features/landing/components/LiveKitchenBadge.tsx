import { common } from "@/shared/data/common";

export function LiveKitchenBadge() {
  return (
    <div className="absolute right-5 top-[max(1rem,env(safe-area-inset-top))] z-20 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-md ring-1 ring-stone-200/80 backdrop-blur-md dark:bg-zinc-900/95 dark:text-zinc-200 dark:ring-zinc-700">
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
      {common.landing.liveKitchen}
    </div>
  );
}
