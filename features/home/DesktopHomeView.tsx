import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/features/home/components/ProductCard";
import { IconGrid } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/Button";
import { useCommon } from "@/shared/data/common-copy-provider";
import { getProductsByCategory, useMenuStore } from "@/shared/data/menu";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import type { Product } from "@/shared/types/food";

type ActiveNav = "all" | string;

function applySearch(products: Product[], q: string): Product[] {
  const s = q.trim().toLowerCase();
  if (!s) return products;
  return products.filter(
    (p) => p.name.toLowerCase().includes(s) || (p.subtitle && p.subtitle.toLowerCase().includes(s)),
  );
}

export function DesktopHomeView() {
  const common = useCommon();
  const categories = useMenuStore((s) => s.categories);
  const products = useMenuStore((s) => s.products);
  const router = useRouter();
  const d = common.desktop;
  const explore = d.explore;
  const exploreRef = useRef<HTMLDivElement>(null);
  const [activeNav, setActiveNav] = useState<ActiveNav>("all");

  const searchQ = typeof router.query.q === "string" ? router.query.q : "";

  const baseList = useMemo(() => applySearch(products, searchQ), [products, searchQ]);

  const categoriesOnMenu = useMemo(
    () =>
      categories.filter((c) =>
        getProductsByCategory(c.id).some((p) => baseList.some((x) => x.id === p.id)),
      ),
    [categories, baseList],
  );

  const resolvedNav = useMemo<ActiveNav>(() => {
    if (activeNav === "all") return "all";
    return categoriesOnMenu.some((c) => c.id === activeNav) ? activeNav : "all";
  }, [activeNav, categoriesOnMenu]);

  const scopedList = useMemo(() => {
    if (resolvedNav === "all") return baseList;
    return baseList.filter((p) => p.categoryId === resolvedNav);
  }, [baseList, resolvedNav]);

  const showSectionedMenu = resolvedNav === "all" && !searchQ.trim();

  const activeCategory = useMemo(
    () => (resolvedNav === "all" ? undefined : categories.find((c) => c.id === resolvedNav)),
    [resolvedNav, categories],
  );

  const scrollToMenu = useCallback(() => {
    exploreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (router.query.q && typeof router.query.q === "string") {
      scrollToMenu();
    }
  }, [router.query.q, scrollToMenu]);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stone-200/40 via-transparent to-transparent dark:from-zinc-800/30" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bj-bg)] to-transparent" />
        <div className="relative mx-auto grid max-w-[1360px] gap-10 pr-6 py-14 desktop:grid-cols-2 desktop:items-center desktop:py-20">
          <div className="z-10 max-w-xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bj-gold)]">
              <span className="mr-2 inline-block h-px w-8 translate-y-[-3px] bg-[var(--bj-gold)] align-middle" aria-hidden />
              {d.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-900 dark:text-white xl:text-5xl">
              {d.hero.headingLine1}
              <br />
              <span className="text-[var(--bj-gold)]">{d.hero.headingLine2}</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-stone-600 dark:text-zinc-400">{d.hero.body}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" variant="primary" className="px-8 py-3 text-sm font-semibold" onClick={scrollToMenu}>
                {d.hero.exploreMenu}
              </Button>
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center rounded-full border border-stone-400 px-8 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                {d.hero.ourStory}
              </Link>
            </div>
          </div>
          <div className="relative z-10 mx-auto aspect-[4/3] w-full max-w-lg desktop:mx-0 desktop:max-w-none">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-3xl ring-1 ring-stone-200/80 dark:ring-zinc-700/80 desktop:min-h-[360px]">
              <Image
                src={resolveImageSrc("/images/landing-hero.png")}
                alt={common.home.promoHero.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width:600px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent dark:from-black/50" />
            </div>
          </div>
        </div>
      </section>

      <div ref={exploreRef} id="desktop-explore-menu" className="mx-auto max-w-[1360px] scroll-mt-28 pr-6 pt-14">
        <div className="flex flex-col gap-10 desktop:flex-row desktop:items-start">
          <aside className="w-full shrink-0 desktop:sticky desktop:top-[5.25rem] desktop:z-10 desktop:max-h-[calc(100dvh-6rem)] desktop:w-56 desktop:overflow-y-auto desktop:self-start desktop:pr-1">
            <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">{explore.filtersTitle}</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-zinc-500">{explore.filtersSubtitle}</p>

            <nav className="mt-6 space-y-2" aria-label="Menu">
              <button
                type="button"
                onClick={() => {
                  setActiveNav("all");
                  scrollToMenu();
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  resolvedNav === "all"
                    ? "bg-[var(--bj-gold-fill)] text-[#1a1203] shadow-sm"
                    : "border border-stone-200 bg-[var(--bj-card)] text-stone-700 hover:border-[var(--bj-gold)]/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                }`}
              >
                <IconGrid className="h-4 w-4 shrink-0" />
                {explore.filterAll}
              </button>
            </nav>

            <h3 className="mt-8 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
              {common.home.categoriesHeading}
            </h3>
            <nav className="mt-3 flex flex-row gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] desktop:flex-col desktop:gap-2 desktop:overflow-visible [&::-webkit-scrollbar]:hidden" aria-label={common.home.categoriesHeading}>
              {categoriesOnMenu.map((cat) => {
                const active = resolvedNav === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(cat.id);
                      scrollToMenu();
                    }}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition desktop:w-full ${
                      active
                        ? "bg-[var(--bj-gold-fill)] text-[#1a1203] shadow-sm"
                        : "border border-stone-200 bg-[var(--bj-card)] text-stone-700 hover:border-[var(--bj-gold)]/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    }`}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[var(--bj-gold)]/40">
                      <Image
                        src={resolveImageSrc(cat.image)}
                        alt=""
                        fill
                        className="object-cover object-[center_44%]"
                        sizes="40px"
                      />
                    </span>
                    <span className="min-w-0 truncate">{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{explore.title}</h2>
                <p className="mt-1 text-lg text-[var(--bj-gold)]">{explore.tagline}</p>
              </div>
            </div>

            {showSectionedMenu ? (
              <div className="mt-10 space-y-14">
                {categories.map((cat) => {
                  const items = getProductsByCategory(cat.id).filter((p) => baseList.some((x) => x.id === p.id));
                  if (items.length === 0) return null;
                  return (
                    <section key={cat.id} id={`menu-${cat.id}`} className="scroll-mt-32">
                      <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-[var(--bj-gold)]">{cat.menuHeading}</h3>
                      <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
                        {items.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            ctaLabel={explore.quickAdd}
                            imageSizes="(max-width:1400px) 30vw, 360px"
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <>
                {activeCategory ? (
                  <h3 className="mb-6 mt-10 text-sm font-bold uppercase tracking-wide text-[var(--bj-gold)]">
                    {activeCategory.menuHeading}
                  </h3>
                ) : searchQ.trim() ? (
                  <h3 className="sr-only">Search results</h3>
                ) : null}
                <div className={`grid grid-cols-2 gap-6 xl:grid-cols-3 ${activeCategory ? "mt-0" : "mt-10"}`}>
                  {scopedList.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      ctaLabel={explore.quickAdd}
                      imageSizes="(max-width:1400px) 30vw, 360px"
                    />
                  ))}
                </div>
              </>
            )}

            {!showSectionedMenu && scopedList.length === 0 ? (
              <p className="mt-10 text-center text-sm text-stone-500 dark:text-zinc-500">{common.cart.emptyMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
