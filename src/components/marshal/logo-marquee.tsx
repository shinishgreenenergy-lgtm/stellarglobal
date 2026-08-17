import type { CSSProperties } from "react";

/**
 * Seamless marquee for the connected-systems strip.
 *
 * The track is rendered twice and the pair translates by -50%, so the second
 * copy lands exactly where the first began and the loop has no seam. Only the
 * first copy is exposed to assistive tech; the duplicate is aria-hidden so
 * each system is announced once.
 *
 * Third-party names are rendered as text wordmarks, not logo images. AWS,
 * Okta and the rest are trademarks: naming them to state a real integration
 * is fine, synthesising imitation logo files is not. If official SVGs are
 * supplied under each vendor's brand terms, swap the <li> content for an
 * <img> and keep the structure.
 */
export function LogoMarquee({ items, speed = 2.4 }: { items: readonly string[]; speed?: number }) {
  const duration = `${(items.length * speed).toFixed(1)}s`;

  const track = (copy: number) => (
    <ul
      key={copy}
      data-marquee-track
      aria-hidden={copy === 1 ? "true" : undefined}
      aria-label={copy === 0 ? "Connected systems" : undefined}
      className="m-0 flex shrink-0 list-none items-center gap-2.5 p-0 pr-2.5"
    >
      {items.map((name) => (
        <li
          key={name}
          className="border-marshal-neutral-800 bg-marshal-surface text-marshal-text/80 hover:border-marshal-accent hover:text-marshal-accent-300 shrink-0 rounded-lg border px-[11px] py-[5px] text-sm whitespace-nowrap transition-colors"
        >
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-marquee
      style={{ "--marquee-duration": duration } as CSSProperties}
      className="marshal-marquee relative overflow-hidden"
    >
      <div className="marshal-marquee-inner flex w-max">{[track(0), track(1)]}</div>
    </div>
  );
}
