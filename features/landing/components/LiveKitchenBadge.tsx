export function LiveKitchenBadge() {
  return (
    <div className="absolute right-5 top-[max(1rem,env(safe-area-inset-top))] z-20 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
      Live Kitchen
    </div>
  );
}
