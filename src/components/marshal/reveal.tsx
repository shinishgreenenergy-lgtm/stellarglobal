"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered reveal.
 *
 * The children are always rendered and only the *style* changes, driven by a
 * data attribute. Conditional mounting would hide the content from crawlers
 * and from anyone whose JS never runs — and on a marketing site that is the
 * whole page. The reduced-motion CSS sets opacity to 1 unconditionally, so a
 * failed observer can never leave a section invisible.
 */
export function Reveal({
  children,
  delay = 0,
  as: As = "div" as ElementType,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No reduced-motion branch here on purpose: the CSS media query pins
    // opacity to 1 and drops the transition, so the settled state is already
    // guaranteed without a synchronous setState during the effect.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      className={`marshal-reveal ${className}`.trim()}
    >
      {children}
    </As>
  );
}
