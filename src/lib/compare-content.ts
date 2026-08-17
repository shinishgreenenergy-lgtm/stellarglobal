import { BRAND } from "@/lib/brand";
import { compareMenu } from "@/lib/marshal-content";

/**
 * Comparison pages.
 *
 * These pages exist to give the nine dead "Compare" menu links a real
 * destination and to state Marshal's own position on the dimensions buyers
 * actually evaluate.
 *
 * They deliberately make NO factual claims about competitors. Claims about a
 * named company have to come from that company's own current documentation,
 * with the URL and the date it was checked — anything less is a defamation
 * exposure dressed up as marketing, and second-hand comparison blog posts
 * (usually written by one of the vendors involved) are not a source.
 *
 * Until each row carries a sourced competitor value, every page is `indexed:
 * false`: a comparison page with one filled column is thin content, and
 * publishing nine of them invites a doorway-page penalty. Fill `rows[].
 * competitor` and `rows[].source`, flip `indexed` to true, and add the path
 * to ALL_ROUTES to publish.
 */

export type CompareRow = {
  dimension: string;
  /** Marshal's own position — sourced from our product, so safe to state. */
  marshal: string;
  /** What a buyer should confirm with the other vendor. Never a claim. */
  verify: string;
  /** Public URL backing a competitor claim. Required before `indexed`. */
  competitor?: string;
  source?: string;
  checked?: string;
};

export type Comparison = {
  slug: string;
  label: string;
  competitor: string;
  title: string;
  description: string;
  intro: string;
  /** Their own site, so a reader can check rather than take our word. */
  competitorSite?: string;
  indexed: boolean;
  rows: CompareRow[];
  keywords: string[];
};

export function compareSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Dimensions Marshal is judged on. Marshal's column is our own product fact. */
const MARSHAL_POSITIONS: CompareRow[] = [
  {
    dimension: "Saudi regulatory frameworks",
    marshal: "NCA ECC, NCA CSCC, SAMA CSF, SAMA BCM and PDPL ship as first-class control sets.",
    verify: "Ask whether these are native control sets or a custom framework you have to build and maintain yourself.",
  },
  {
    dimension: "Regulator reference IDs",
    marshal:
      "Evidence is filed against the clause IDs the regulator uses, so submissions need no translation sheet.",
    verify: "Ask to see an exported evidence pack and check whether the clause IDs match the regulator's own numbering.",
  },
  {
    dimension: "Cross-framework mapping",
    marshal: "One satisfied control maps to every framework clause it also satisfies, automatically.",
    verify: "Ask how many times the same evidence has to be attached when you carry several frameworks.",
  },
  {
    dimension: "Language",
    marshal: "Arabic and English, including the exported audit pack.",
    verify: "Ask whether Arabic covers the full product and its exports, or only the interface.",
  },
  {
    dimension: "Access model",
    marshal:
      "Read-only, scoped per system. No agent runs on your workloads and nothing is written back to production.",
    verify: "Ask what write scopes the connectors request and whether an agent is installed.",
  },
  {
    dimension: "Implementation",
    marshal: `Delivered by the ${BRAND.company} team, including migration with dates preserved and a parallel run.`,
    verify: "Ask who performs the implementation, and what it costs beyond the licence.",
  },
];

/** Official sites, so readers can verify rather than trust either party. */
const COMPETITOR_SITES: Record<string, string> = {
  Vanta: "https://www.vanta.com",
  Drata: "https://drata.com",
  Sprinto: "https://sprinto.com",
  Secureframe: "https://secureframe.com",
  OneTrust: "https://www.onetrust.com",
  "Cyber Arrow": "https://www.cyberarrow.io",
  "GRC Vantage": "https://www.grcvantage.com",
  Sahl: undefined as unknown as string,
};

function competitorFrom(label: string): string {
  return label.replace(/^Marshal vs\s+/i, "").trim();
}

export const COMPARISONS: Comparison[] = compareMenu
  // "NCA ECC vs SAMA CSF" compares two frameworks, not two vendors — it needs
  // a different page shape and is out of scope here.
  .filter((label) => /^Marshal vs /i.test(label))
  .map((label) => {
    const competitor = competitorFrom(label);
    return {
      slug: compareSlug(label),
      label,
      competitor,
      title: `${BRAND.product} vs ${competitor}`,
      description: `Compare ${BRAND.product} and ${competitor} on Saudi regulatory coverage, cross-framework mapping, language and access model — with Marshal's position stated plainly and every ${competitor} claim left to be verified at source.`,
      intro: `What ${BRAND.product} does on the dimensions buyers weigh when replacing a GRC platform. We state our own position and point you at ${competitor}'s documentation rather than characterising their product for them.`,
      competitorSite: COMPETITOR_SITES[competitor],
      indexed: false,
      rows: MARSHAL_POSITIONS,
      keywords: [
        `${BRAND.product} vs ${competitor}`,
        `${competitor} alternative`,
        `${competitor} competitor`,
        "GRC platform comparison",
        "compliance automation comparison",
      ],
    };
  });

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
