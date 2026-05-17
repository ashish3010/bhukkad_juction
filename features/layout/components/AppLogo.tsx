import Image from "next/image";
import { LOGO_PATH, SITE_NAME } from "@/shared/site-meta";

type Props = {
  /** Width in CSS pixels; height matches for square frame (image uses object-contain). */
  width: number;
  className?: string;
  /** When true, `alt` is empty and `aria-hidden` is set (parent provides label). */
  decorative?: boolean;
  priority?: boolean;
  /**
   * When true, clips the asset to a circle and uses cover scaling so solid dark corners
   * on a square marketing PNG are hidden. Prefer a PNG with a transparent background long term.
   */
  circleCrop?: boolean;
};

export function AppLogo({
  width,
  className = "",
  decorative = false,
  priority = false,
  circleCrop = false,
}: Props) {
  const image = (
    <Image
      src={LOGO_PATH}
      alt={decorative ? "" : `${SITE_NAME} logo`}
      width={width}
      height={width}
      /** Same URL as favicon/OG; without this, `/_next/image` caches and header stays stale after you replace `public/images/logo.png`. */
      unoptimized
      className={
        circleCrop
          ? "h-full w-full object-cover object-center scale-[1.14]"
          : `object-contain ${className}`.trim()
      }
      priority={priority}
      sizes={`${width}px`}
      aria-hidden={decorative || undefined}
    />
  );

  if (!circleCrop) {
    return image;
  }

  return (
    <span
      className={[
        "inline-block",
        "shrink-0",
        "overflow-hidden",
        "rounded-full",
        "bg-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height: width }}
    >
      {image}
    </span>
  );
}
