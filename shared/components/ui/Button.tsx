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
      "rounded-full bg-[var(--bj-gold)] px-5 py-3 text-[#1a1203] shadow-[0_8px_24px_rgba(255,193,7,0.25)]",
    ghost: "rounded-full bg-white/5 px-3 py-2 text-[var(--bj-gold)] hover:bg-white/10",
    icon: "rounded-full bg-black/45 p-2 text-white backdrop-blur-sm hover:bg-black/55",
  };
  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
