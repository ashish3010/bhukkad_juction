import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-[var(--bj-card)] p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
