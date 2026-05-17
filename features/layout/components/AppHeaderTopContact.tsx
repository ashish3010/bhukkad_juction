import { common } from "@/shared/data/common";
import { IconPhone, IconPotSteam } from "@/shared/components/icons";

type Props = {
  /** Extra classes on the outer bar. */
  className?: string;
};

export function AppHeaderTopContact({ className = "" }: Props) {
  const h = common.headerTopBar;

  return (
    <div
      className={[
        "box-border w-[100vw] max-w-[100vw] shrink-0 text-stone-900",
        "ml-[calc(50%-50vw)] border-b border-amber-900/12 bg-[#fcf4dd]",
        "pb-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] text-center desktop:pb-2.5 desktop:pt-[calc(env(safe-area-inset-top,0px)+0.625rem)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase leading-snug tracking-wide desktop:text-xs">
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <IconPotSteam className="h-3.5 w-3.5 shrink-0 text-amber-900/90 desktop:h-4 desktop:w-4" />
          <span>{h.tagline}</span>
        </span>
        <span className="shrink-0 text-amber-900/35" aria-hidden>
          |
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <IconPhone className="h-3.5 w-3.5 shrink-0 text-amber-900/90 desktop:h-4 desktop:w-4" />
          <span className="whitespace-nowrap">
            {h.orderPrefix}{" "}
            <a
              href={`tel:${h.phoneTel}`}
              className="font-bold text-amber-950 underline decoration-amber-900/25 underline-offset-2 transition hover:decoration-amber-900/60"
            >
              {h.phoneDisplay}
            </a>
          </span>
        </span>
      </p>
    </div>
  );
}
