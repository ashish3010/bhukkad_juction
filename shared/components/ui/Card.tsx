import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/90 bg-[var(--bj-card)] p-4 shadow-sm dark:border-zinc-800/90 dark:shadow-none ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
