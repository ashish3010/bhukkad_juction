import { Card } from "@/shared/components/ui/Card";

type Props = {
  total: number;
};

export function PriceSummary({ total }: Props) {
  return (
    <section className="px-4 pt-6">
      <Card className="p-4">
        <div className="flex justify-between text-base font-bold text-[var(--bj-gold)]">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </Card>
    </section>
  );
}
