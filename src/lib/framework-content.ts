import { FRAMEWORK_FACTS, type FrameworkFact } from "@/lib/compliance-facts";
import { automationGroups, type Automation } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

export type FrameworkPage = {
  fact: FrameworkFact;
  title: string;
  description: string;
  intro: string;
  automations: Automation[];
  keywords: string[];
};

/**
 * Automations whose `maps` string references this framework.
 *
 * The mapping strings in marshal-content use short forms ("ECC 2-2-3",
 * "ISO A.5.11", "CC6.2", "SAMA 3.3.5", "PCI 8.4"), so each framework declares
 * the tokens that identify it rather than relying on its display name.
 */
const MATCH_TOKENS: Record<string, string[]> = {
  "nca-ecc": ["ECC "],
  "nca-cscc": ["ECC "],
  "sama-csf": ["SAMA 3", "SAMA CSF"],
  "sama-bcm": ["SAMA BCM"],
  pdpl: ["PDPL"],
  "iso-27001": ["ISO A.", "ISO 5.", "ISO 6.", "ISO 9."],
  "iso-22301": ["ISO 22301"],
  "soc-2": ["CC1", "CC4", "CC6", "CC7", "CC8", "CC9", "CC A1"],
  "pci-dss": ["PCI "],
  gdpr: ["GDPR"],
  "nist-csf": ["ISO 27005", "Unified control set"],
  custom: ["Unified control set", "Regulator submission"],
};

function automationsFor(fact: FrameworkFact): Automation[] {
  const tokens = MATCH_TOKENS[fact.slug] ?? [fact.name];
  return automationGroups
    .flatMap((g) => g.items)
    .filter((a) => tokens.some((t) => a.maps.toLowerCase().includes(t.toLowerCase())))
    .slice(0, 8);
}

function describe(fact: FrameworkFact): string {
  const scope =
    fact.controlCount === null
      ? `${fact.name} obligations`
      : `${fact.controlCount} ${fact.controlUnit}`;
  return `Automate ${scope} with ${BRAND.product}: continuous evidence collection, scheduled control testing and audit-ready reporting for ${fact.name}.`;
}

export const FRAMEWORK_PAGES: FrameworkPage[] = FRAMEWORK_FACTS.map((fact) => ({
  fact,
  title: `${fact.name} compliance automation`,
  description: describe(fact),
  intro: fact.summary,
  automations: automationsFor(fact),
  keywords: [
    `${fact.name} compliance`,
    `${fact.name} automation`,
    `${fact.name} controls`,
    `${fact.name} audit`,
    `${fact.name} evidence collection`,
    `${fact.name} compliance software`,
  ],
}));

export function getFrameworkPage(slug: string): FrameworkPage | undefined {
  return FRAMEWORK_PAGES.find((p) => p.fact.slug === slug);
}
