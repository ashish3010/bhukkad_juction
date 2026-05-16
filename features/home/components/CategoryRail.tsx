import Image from "next/image";
import { memo } from "react";
import { common } from "@/shared/data/common";
import type { Category } from "@/shared/types/food";

type Props = { categories: Category[] };

export const CategoryRail = memo(function CategoryRail({ categories }: Props) {
  return (
    <section id="categories" className="pb-6">
      <div className="mb-3 px-4">
        <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100">{common.home.categoriesHeading}</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#menu-${c.id}`}
            className="w-20 shrink-0 text-center scroll-mt-28"
          >
            <div className="relative mx-auto box-border h-16 w-16 overflow-hidden rounded-full border-2 border-[var(--bj-gold)]/40">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="rounded-full object-cover object-[center_44%]"
                sizes="64px"
              />
            </div>
            <p className="mt-2 truncate text-xs font-medium text-stone-700 dark:text-zinc-300">{c.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
});
