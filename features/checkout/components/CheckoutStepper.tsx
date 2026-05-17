import { IconCheck } from "@/shared/components/icons";
import { common } from "@/shared/data/common";

export type CheckoutStep = 1 | 2;

type Props = { current: CheckoutStep };

function StepCircle({
  step,
  current,
}: {
  step: CheckoutStep;
  current: CheckoutStep;
}) {
  const done = current > step;
  const active = current === step;
  const gold = done || active;
  return (
    <div
      className={`box-border flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
        gold
          ? "border-[var(--bj-gold)] bg-[var(--bj-gold-fill)] text-[#1a1203]"
          : "border-stone-300 bg-stone-100 text-stone-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
      }`}
    >
      {done ? <IconCheck className="h-5 w-5" /> : <span>{step}</span>}
    </div>
  );
}

function StepLabel({
  step,
  current,
  label,
}: {
  step: CheckoutStep;
  current: CheckoutStep;
  label: string;
}) {
  const done = current > step;
  const active = current === step;
  const gold = done || active;
  return (
    <span className={`text-xs font-semibold ${gold ? "text-[var(--bj-gold)]" : "text-stone-500 dark:text-zinc-500"}`}>{label}</span>
  );
}

export function CheckoutStepper({ current }: Props) {
  const steps: { step: CheckoutStep; label: string }[] = [
    { step: 1, label: common.checkout.stepCart },
    { step: 2, label: common.checkout.stepDelivery },
  ];
  const [first, second] = steps;

  return (
    <div className="flex justify-center px-4 pb-1 pt-5 min-[601px]:px-0 min-[601px]:pt-3">
      <div className="grid w-fit grid-cols-[auto_1.25rem_auto] items-center justify-items-center gap-x-1.5 gap-y-2">
        <StepCircle step={first.step} current={current} />
        <div className="flex h-10 w-full items-center justify-center self-center">
          <div className="h-px w-full bg-stone-300 dark:bg-zinc-600" />
        </div>
        <StepCircle step={second.step} current={current} />
        <StepLabel step={first.step} current={current} label={first.label} />
        <div aria-hidden className="min-w-0" />
        <StepLabel step={second.step} current={current} label={second.label} />
      </div>
    </div>
  );
}
