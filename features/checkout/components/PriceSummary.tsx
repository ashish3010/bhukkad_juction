import { Card } from "@/shared/components/ui/Card";
import { common } from "@/shared/data/common";

type Props = {
  total: number;
};

export function PriceSummary({ total }: Props) {
  return (
    <section className="px-4 pt-6 min-[601px]:px-0 min-[601px]:pt-4">
      <Card className="p-4">
        <div className="flex justify-between text-base font-bold text-[var(--bj-gold)]">
          <span>{common.cart.total}</span>
          <span>₹{total}</span>
        </div>
      </Card>
    </section>
  );
}
