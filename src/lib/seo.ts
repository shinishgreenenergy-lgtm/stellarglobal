import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { BASE_PATH } from "@/lib/asset";

/**
 * Production origin.
 *
 * GitHub Pages serves this repo at a subpath. If a custom domain is added,
 * change SITE_URL here and set BASE_PATH to "" in src/lib/asset.ts, then drop
 * basePath/assetPrefix from next.config.ts — those three must agree.
 */
export const SITE_URL = "https://stellarglobal.github.io";

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
