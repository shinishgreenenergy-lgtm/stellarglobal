/**
 * Verified framework facts. Every entry carries the primary source it was
 * checked against.
 *
 * Rule: no number ships without a source. A GRC vendor publishing a wrong
 * control count is a credibility failure, not a typo. If a figure cannot be
 * confirmed, put the slug in UNVERIFIED_CLAIMS and set controlCount to null.
 *
 * Checked 2026-08-17. Two figures inherited from the design handoff were wrong
 * and have been corrected here and in marshal-content.ts:
 *   - NCA CSCC was published as "85 controls"; CSCC-1:2019 has 32 main
 *     controls (and 73 subcontrols). Neither is 85.
 *   - SAMA CSF was published as "250 controls"; the framework carries roughly
 *     118 control considerations across 4 domains and 32 subdomains.
 */
export type FrameworkFact = {
  slug: string;
  name: string;
  officialName: string;
  authority: string;
  region: string;
  controlCount: number | null;
  controlUnit: string;
  summary: string;
  source: string;
};

export const FRAMEWORK_FACTS: FrameworkFact[] = [
  {
    slug: "nca-ecc",
    name: "NCA ECC",
    officialName: "Essential Cybersecurity Controls (ECC-2:2024)",
    authority: "National Cybersecurity Authority",
    region: "Saudi Arabia",
    controlCount: 108,
    controlUnit: "main controls",
    summary:
      "The Saudi cybersecurity baseline. ECC-2:2024 spans 4 main domains and 28 subdomains, carrying 108 main controls and 92 subcontrols — a consolidation of the 114 controls in ECC-1:2018.",
    source: "https://nca.gov.sa/en/regulatory-documents/controls-list/ecc/",
  },
  {
    slug: "nca-cscc",
    name: "NCA CSCC",
    officialName: "Critical Systems Cybersecurity Controls (CSCC-1:2019)",
    authority: "National Cybersecurity Authority",
    region: "Saudi Arabia",
    controlCount: 32,
    controlUnit: "main controls",
    summary:
      "Controls layered on top of the ECC for organisations running critical systems. CSCC-1:2019 carries 32 main controls and 73 subcontrols, and applies in addition to — not instead of — the ECC.",
    source: "https://nca.gov.sa/en/regulatory-documents/controls-list/cscc/",
  },
  {
    slug: "sama-csf",
    name: "SAMA CSF",
    officialName: "SAMA Cyber Security Framework, Version 1.0",
    authority: "Saudi Central Bank (SAMA)",
    region: "Saudi Arabia",
    controlCount: 118,
    controlUnit: "control considerations",
    summary:
      "The framework Saudi Central Bank member organisations are assessed against: 4 domains, 32 subdomains and roughly 118 control considerations, scored on a 5-level maturity model.",
    source:
      "https://www.sama.gov.sa/en-US/Laws/BankingRules/SAMA%20Cyber%20Security%20Framework.pdf",
  },
  {
    slug: "sama-bcm",
    name: "SAMA BCM",
    officialName: "SAMA Business Continuity Management Framework, Version 1.0",
    authority: "Saudi Central Bank (SAMA)",
    region: "Saudi Arabia",
    controlCount: 75,
    controlUnit: "controls",
    summary:
      "Business continuity for SAMA-supervised entities: 13 key areas carrying more than 75 controls, aligned to ISO 22301 and ISO 31000.",
    source: "https://www.sama.gov.sa/en-US/Laws/BankingRules/BCM%20framework.pdf",
  },
  {
    slug: "pdpl",
    name: "PDPL",
    officialName: "Personal Data Protection Law and its Implementing Regulations",
    authority: "Saudi Data & AI Authority (SDAIA)",
    region: "Saudi Arabia",
    controlCount: null,
    controlUnit: "obligations",
    summary:
      "Saudi Arabia's personal data law. It sets obligations rather than a numbered control set — lawful basis, records of processing, data subject rights, and breach notification to SDAIA within 72 hours under Article 24 of the Implementing Regulations.",
    source: "https://sdaia.gov.sa/en/SDAIA/about/Documents/Personal%20Data%20English%20V2-23April2023-%20Reviewed-.pdf",
  },
  {
    slug: "iso-27001",
    name: "ISO/IEC 27001",
    officialName: "ISO/IEC 27001:2022 — Information security management systems",
    authority: "International Organization for Standardization",
    region: "International",
    controlCount: 93,
    controlUnit: "Annex A controls",
    summary:
      "The management-system standard for information security. The 2022 revision restructures Annex A into 4 themes — organisational, people, physical and technological — carrying 93 controls.",
    source: "https://www.iso.org/standard/27001",
  },
  {
    slug: "iso-22301",
    name: "ISO 22301",
    officialName: "ISO 22301:2019 — Business continuity management systems",
    authority: "International Organization for Standardization",
    region: "International",
    controlCount: null,
    controlUnit: "lifecycle clauses",
    summary:
      "The business continuity management system standard. Like ISO 27001's main body it specifies management-system clauses rather than a numbered control catalogue.",
    source: "https://www.iso.org/standard/75106.html",
  },
  {
    slug: "soc-2",
    name: "SOC 2",
    officialName: "SOC 2 — Trust Services Criteria",
    authority: "AICPA",
    region: "United States",
    controlCount: 5,
    controlUnit: "trust services criteria",
    summary:
      "An attestation report, not a certification. Scope is chosen from five Trust Services Criteria — security, availability, processing integrity, confidentiality and privacy — with security always in scope.",
    source:
      "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services",
  },
  {
    slug: "pci-dss",
    name: "PCI DSS v4.0",
    officialName: "Payment Card Industry Data Security Standard v4.0",
    authority: "PCI Security Standards Council",
    region: "International",
    controlCount: 12,
    controlUnit: "requirements",
    summary:
      "Twelve principal requirements covering the cardholder data environment, with customised and defined implementation approaches introduced in v4.0.",
    source: "https://www.pcisecuritystandards.org/document_library/",
  },
  {
    slug: "gdpr",
    name: "GDPR",
    officialName: "Regulation (EU) 2016/679 — General Data Protection Regulation",
    authority: "European Union",
    region: "European Union",
    controlCount: null,
    controlUnit: "articles",
    summary:
      "The EU data protection regulation. It imposes legal obligations — records of processing, DPIAs, subject requests, transfer safeguards and 72-hour breach notification — rather than a control catalogue.",
    source: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
  {
    slug: "nist-csf",
    name: "NIST CSF 2.0",
    officialName: "NIST Cybersecurity Framework 2.0",
    authority: "National Institute of Standards and Technology",
    region: "United States",
    controlCount: 6,
    controlUnit: "functions",
    summary:
      "Six functions — Govern, Identify, Protect, Detect, Respond and Recover — with Govern added in the 2.0 revision. A voluntary framework mapped onto your existing control set.",
    source: "https://www.nist.gov/cyberframework",
  },
  {
    slug: "custom",
    name: "Custom",
    officialName: "Customer-defined control set",
    authority: "Your organisation",
    region: "Any",
    controlCount: null,
    controlUnit: "controls",
    summary:
      "Internal standards, client contract schedules or a regulator-specific set you already maintain — imported and mapped onto the unified control library.",
    source: "https://www.iso.org/standard/27001",
  },
];

/**
 * Slugs whose published figures could not be confirmed against a primary
 * source. Anything listed here renders "—" rather than a number.
 */
export const UNVERIFIED_CLAIMS: string[] = [];
