import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useCommon } from "@/shared/data/common-copy-provider";

type Props = {
  text: string;
  /** Classes for the summary line (font size, color). */
  textClassName: string;
  /**
   * When true (default), vertically centers this block with a row sibling thumbnail
   * if there is no “View more” control. Set false when this sits in a stacked column (e.g. mobile card).
   */
  inlineWithThumbnail?: boolean;
};

export function OrderItemsSummaryCollapsible({
  text,
  textClassName,
  inlineWithThumbnail = true,
}: Props) {
  const common = useCommon();
  const [expanded, setExpanded] = useState(false);
  const [lineTruncates, setLineTruncates] = useState(false);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const expandedRef = useRef(expanded);

  useLayoutEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  const measure = useCallback(() => {
    const el = lineRef.current;
    if (!el || expandedRef.current) return;
    setLineTruncates(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [text, textClassName, expanded, measure]);

  useLayoutEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const c = common.orders;
  const crossAlign =
    inlineWithThumbnail && !lineTruncates && !expanded ? "self-center" : "self-start";

  return (
    <div className={`min-w-0 flex-1 ${crossAlign}`}>
      <p ref={lineRef} className={`${textClassName} ${expanded ? "" : "truncate"}`}>
        {text}
      </p>
      {lineTruncates ? (
        <button
          type="button"
          className="mt-1 text-left text-xs font-semibold text-[var(--bj-gold)] underline decoration-[var(--bj-gold)]/40 underline-offset-2 transition hover:decoration-[var(--bj-gold)]"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? c.viewLess : c.viewMore}
        </button>
      ) : null}
    </div>
  );
}
