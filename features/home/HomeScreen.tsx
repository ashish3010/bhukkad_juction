import { getProductsByCategory, useMenuStore } from "@/shared/data/menu";
import { CategoryRail } from "@/features/home/components/CategoryRail";
import { ProductCard } from "@/features/home/components/ProductCard";
import { PromoHero } from "@/features/home/components/PromoHero";
import { DesktopHomeView } from "@/features/home/DesktopHomeView";

export function HomeScreen() {
  const categories = useMenuStore((s) => s.categories);
  return (
    <>
      <div className="space-y-2 pb-4 desktop:hidden">
        <PromoHero />
        <CategoryRail categories={categories} />
        {categories.map((cat) => {
          const items = getProductsByCategory(cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id={`menu-${cat.id}`} className="scroll-mt-24 px-4 pb-6">
              <h3 className="mb-3 text-sm font-bold leading-snug text-[var(--bj-gold)]">{cat.menuHeading}</h3>
              <div className="grid grid-cols-2 gap-3">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <div className="hidden desktop:block">
        <DesktopHomeView />
      </div>
    </>
  );
}
