import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const styles: Record<Variant, string> = {
    primary:
      "rounded-full bg-[var(--bj-gold-fill)] px-5 py-3 text-[#1a1203] shadow-[0_8px_24px_rgba(240,180,41,0.35)]",
    ghost:
      "rounded-full bg-stone-100 px-3 py-2 text-[var(--bj-gold)] hover:bg-stone-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700",
    icon: "rounded-full bg-stone-200/90 p-2 text-stone-800 backdrop-blur-sm hover:bg-stone-300/90 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
  };
  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
