import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { BASE_PATH } from "@/lib/asset";

/**
 * Canonical production origin.
 *
 * The site is reachable on more than one host (Netlify and GitHub Pages).
 * Canonicals, OpenGraph urls, JSON-LD and the sitemap must all name ONE of
 * them, or the two copies compete as duplicate content and search engines
 * pick a winner for you. Netlify is the canonical host; the Pages build emits
 * the same canonicals, which is correct — it points crawlers at the primary.
 *
 * Override per-deploy with NEXT_PUBLIC_SITE_URL. Set it to the custom domain
 * when one is registered.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stellar-global-india.netlify.app"
).replace(/\/+$/, "");

export { BASE_PATH };

/**
 * Next prepends basePath to <Link> and router navigations, but NOT to strings
 * hand-written into canonical tags, JSON-LD or the sitemap. Those come here.
 */
export function absoluteUrl(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/\/{2,}/g, "/");
  return clean ? `${SITE_URL}${BASE_PATH}/${clean}` : `${SITE_URL}${BASE_PATH}`;
}

export type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noindex,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  // Avoid "Marshal vs Vanta | Marshal by Stellar Global" — if the product name
  // is already in the title, only the company gets appended.
  const fullTitle = title.includes(BRAND.product)
    ? `${title} | ${BRAND.company}`
    : `${title} | ${BRAND.productFull}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: BRAND.productFull,
      title: fullTitle,
      description,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
