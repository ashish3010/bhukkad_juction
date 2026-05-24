import type { ReactNode } from "react";
import { useCommon } from "@/shared/data/common-copy-provider";
import {
  GOOGLE_MAPS_EMBED_SRC,
  GOOGLE_MAPS_PLACE_URL,
} from "@/shared/site-meta";

function RichLine({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((s) => s.length > 0);
  return parts.map((seg, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(seg);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-[var(--bj-gold)]">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

function StarRow({ stars }: { stars: number }) {
  return (
    <div
      className="flex justify-center gap-0.5 text-lg leading-none"
      aria-label={`${stars} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < stars ? "text-amber-500" : "text-stone-300"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function OurStorySection() {
  const common = useCommon();
  const s = common.desktop.ourStorySection;

  return (
    <section className="scroll-mt-28 border-b border-stone-200/80 py-14 dark:border-zinc-800/80">
      <div className="mx-auto max-w-[1360px] px-4 desktop:pr-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-stone-900 dark:text-white sm:text-3xl">
            {s.block1Title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-stone-600 dark:text-zinc-400 sm:text-base">
            {s.block1Body}
          </p>

          <h3 className="mt-12 text-xl font-bold text-stone-900 dark:text-white sm:text-2xl">
            {s.block2Title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-zinc-400 sm:text-base">
            <RichLine text={s.block2Paragraph1} />
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-zinc-400 sm:text-base">
            <RichLine text={s.block2Paragraph2} />
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <h3 className="text-center text-2xl font-bold text-stone-900 dark:text-white">
            {s.mapHeading}
          </h3>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-stone-100 shadow-2xl dark:bg-zinc-900">
            <div className="relative h-[300px] w-full sm:h-[420px] lg:h-[500px]">
              <iframe
                src={GOOGLE_MAPS_EMBED_SRC}
                width="100%"
                height="500"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <a
              href={GOOGLE_MAPS_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--bj-gold-fill)] px-8 py-3 text-sm font-semibold leading-none tracking-tight text-[#1a1203] shadow-[0_6px_20px_rgba(240,180,41,0.3)] transition hover:brightness-105 active:scale-[0.99] dark:shadow-[0_6px_24px_rgba(255,193,7,0.2)]"
            >
              {s.mapOpenExternal}
            </a>
          </div>
        </div>

        <h3 className="mt-14 text-center text-lg font-bold text-stone-900 dark:text-white sm:text-xl">
          {s.reviewsHeading}
        </h3>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.reviews.map((r) => (
            <article
              key={r.name}
              className="flex flex-col rounded-2xl bg-white p-5 text-center text-stone-900 shadow-md ring-1 ring-black/5 dark:bg-zinc-100 dark:text-stone-900"
            >
              <StarRow stars={r.stars} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-bold text-stone-900">{r.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
