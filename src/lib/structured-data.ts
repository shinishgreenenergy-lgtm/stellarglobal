import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";

/**
 * JSON-LD builders.
 *
 * Every url goes through absoluteUrl(): crawlers cannot resolve a relative
 * path inside JSON-LD, and the basePath has to be present.
 *
 * Deliberately absent: aggregateRating, review, and offers. Those earn rich
 * results but require real, verifiable data — inventing them is exactly the
 * kind of structured-data spam that draws a manual action.
 */

type Faq = { q: string; a: string };
type Crumb = { name: string; path: string };

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization" as const,
    name: BRAND.company,
    url: absoluteUrl("/"),
    email: BRAND.email,
    description: `${BRAND.company} builds ${BRAND.product}, ${BRAND.descriptor}.`,
  };
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication" as const,
    name: BRAND.product,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description: `${BRAND.product} is ${BRAND.descriptor} from ${BRAND.company}.`,
    publisher: { "@type": "Organization" as const, name: BRAND.company },
  };
}

export function faqPageLd(faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
}

export function breadcrumbLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
