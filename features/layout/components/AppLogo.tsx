import Image from "next/image";
import { LOGO_PATH, SITE_NAME } from "@/shared/site-meta";

type Props = {
  /** Width in CSS pixels; height matches for square frame (image uses object-contain). */
  width: number;
  className?: string;
  /** When true, `alt` is empty and `aria-hidden` is set (parent provides label). */
  decorative?: boolean;
  priority?: boolean;
};

export function AppLogo({ width, className = "", decorative = false, priority = false }: Props) {
  return (
    <Image
      src={LOGO_PATH}
      alt={decorative ? "" : `${SITE_NAME} logo`}
      width={width}
      height={width}
      className={`object-contain ${className}`}
      priority={priority}
      sizes={`${width}px`}
      aria-hidden={decorative || undefined}
    />
  );
}
