/**
 * Target search terms per page slug. Feeds metadata keywords and informs
 * headings — it does not license stuffing.
 *
 * Twelve per page is the cap the test enforces. Breadth of coverage comes from
 * having many well-targeted pages (one per framework, one per comparison), not
 * from crowding terms onto one page: crowding trips spam classifiers and costs
 * the rankings the terms were added to win.
 */
export const KEYWORDS: Record<string, string[]> = {
  home: [
    "GRC platform",
    "compliance automation",
    "automated evidence collection",
    "continuous compliance",
    "NCA ECC compliance software",
    "SAMA CSF compliance",
    "ISO 27001 automation",
    "PDPL compliance Saudi Arabia",
    "SOC 2 automation",
    "risk management software",
    "audit management platform",
    "compliance software Saudi Arabia",
  ],
  privacy: ["privacy policy", "data protection", "PDPL privacy notice", "GDPR privacy policy"],
  terms: ["terms of service", "software licence terms", "SaaS agreement"],
  cookies: ["cookie policy", "cookie consent", "tracking technologies"],
  security: [
    "security practices",
    "SOC 2 report",
    "ISO 27001 certified vendor",
    "data residency",
    "subprocessors",
    "vulnerability disclosure",
  ],
};
