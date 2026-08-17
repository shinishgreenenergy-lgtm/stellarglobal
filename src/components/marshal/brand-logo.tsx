import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { asset } from "@/lib/asset";

/**
 * Brand marks supplied by the owner.
 *
 * src goes through asset(): Next does NOT prepend basePath to next/image src
 * — the docs say to add it yourself — so a bare "/marshal-logo.svg" renders a
 * broken image on the deployed subpath (and in dev, which also serves under
 * the basePath).
 */

/** Marshal product logo — shield, padlock and the STELLAR marshal wordmark. */
export function MarshalLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={asset("/marshal-logo.svg")}
      alt={`${BRAND.product} — ${BRAND.company}`}
      width={603}
      height={132}
      priority
      className={className}
    />
  );
}

/**
 * Stellar Global company wordmark.
 *
 * The supplied PNG has a baked white background, so it is set on its own light
 * chip rather than directly on the page — otherwise it shows as a white box in
 * dark mode. Replace with a transparent SVG and the chip can go.
 */
export function StellarGlobalWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-white px-2 py-1 ${className}`}>
      <Image
        src={asset("/stellar-global-wordmark.png")}
        alt={BRAND.company}
        width={1774}
        height={887}
        className="h-4 w-auto"
      />
    </span>
  );
}
