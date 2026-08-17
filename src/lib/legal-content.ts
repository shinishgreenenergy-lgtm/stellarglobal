import { BRAND } from "@/lib/brand";

export type LegalSection = { heading: string; body: string };
export type LegalPage = {
  title: string;
  intro: string;
  updated: string;
  /** Flip to true only once counsel has signed off. Gates the review banner. */
  reviewed: boolean;
  sections: LegalSection[];
};

/**
 * Drafts, not legal advice.
 *
 * Every page renders an "awaiting legal review" banner while `reviewed` is
 * false. A GRC vendor shipping an unreviewed privacy policy is exactly the
 * failure its own product exists to prevent, so the flag is deliberately not
 * defaulted to true.
 */
export const LEGAL_PAGES: Record<"privacy" | "terms" | "cookies", LegalPage> = {
  privacy: {
    title: "Privacy policy",
    intro: `How ${BRAND.company} collects, uses and protects personal data on this website and in the ${BRAND.product} platform.`,
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Who we are",
        body: `${BRAND.company} is the controller for personal data collected through this website. For data processed inside a customer's ${BRAND.product} tenant, the customer is the controller and ${BRAND.company} is the processor, acting on documented instructions under the data processing agreement.`,
      },
      {
        heading: "What we collect",
        body: "Website: pages visited, referrer, approximate location derived from IP address, and anything you enter into the demo request form — name, work email, company and message. Platform: account identifiers, audit log entries, and the configuration and evidence metadata your connected systems return.",
      },
      {
        heading: "Why we collect it",
        body: "To respond to demo requests, to provide and secure the platform, to meet our own legal and regulatory obligations, and to understand which parts of the site are useful. We do not sell personal data, and we do not use it to train third-party models.",
      },
      {
        heading: "Lawful basis",
        body: "Consent for optional analytics and marketing contact. Contract for providing the platform to a customer. Legitimate interests for security monitoring and service improvement. Legal obligation where retention or disclosure is required of us.",
      },
      {
        heading: "Retention",
        body: "Demo enquiries are kept for 24 months from last contact. Platform data is kept for the life of the subscription and deleted or returned within 30 days of termination, except where law requires a longer period.",
      },
      {
        heading: "Your rights",
        body: `Depending on where you live, you may have rights of access, correction, deletion, portability, restriction and objection, and the right to withdraw consent. Write to ${BRAND.email} and we will respond within the statutory window. You may also complain to your supervisory authority — in Saudi Arabia, SDAIA.`,
      },
      {
        heading: "International transfers",
        body: "Where personal data leaves its country of origin we rely on an approved transfer mechanism and apply the technical and organisational measures described on our security page.",
      },
      {
        heading: "Contact",
        body: `Privacy questions and data subject requests: ${BRAND.email}.`,
      },
    ],
  },

  terms: {
    title: "Terms of service",
    intro: `The terms governing use of this website and the ${BRAND.product} platform: licence, acceptable use, customer data, and the limits of what compliance automation warrants.`,
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Agreement",
        body: `These terms form an agreement between you and ${BRAND.company}. Using this website means you accept them. Use of the ${BRAND.product} platform is governed by the signed order form and master subscription agreement, which take precedence wherever they conflict with these terms.`,
      },
      {
        heading: "Licence",
        body: `Subject to payment and these terms, ${BRAND.company} grants a non-exclusive, non-transferable right to access ${BRAND.product} for internal business use for the subscription term.`,
      },
      {
        heading: "Acceptable use",
        body: "Do not probe or attack the platform's security outside a scope agreed in writing, resell access without authorisation, reverse engineer the service, or upload unlawful content.",
      },
      {
        heading: "Customer data",
        body: "Customers retain all rights in the data they connect or upload. We process it only to provide the service and as the data processing agreement directs.",
      },
      {
        heading: "Availability",
        body: "Service levels, if any, are those stated in the order form. Nothing on this website is a service level commitment.",
      },
      {
        heading: "No compliance warranty",
        body: `${BRAND.product} automates evidence collection, control testing and reporting. It does not certify you, and it is not legal or audit advice. Responsibility for regulatory compliance, and for the accuracy of anything submitted to a regulator or auditor, remains with the customer.`,
      },
      {
        heading: "Limitation of liability",
        body: "To the maximum extent permitted by law, neither party is liable for indirect or consequential loss. Aggregate liability is capped at the amount stated in the order form.",
      },
      {
        heading: "Changes",
        body: "We may update these terms. Material changes will be published on this page with a revised date.",
      },
    ],
  },

  cookies: {
    title: "Cookie policy",
    intro:
      "What this website stores in your browser, why each item is there, and how to block or clear it. No advertising or cross-site tracking cookies are used.",
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Strictly necessary",
        body: "A small number of entries are required for the site to function. These carry no tracking identifier and cannot be switched off without breaking the site.",
      },
      {
        heading: "Analytics",
        body: "If analytics is enabled, it records which pages are visited and how visitors arrive, in aggregate. It loads only after consent and can be declined without losing any functionality.",
      },
      {
        heading: "No advertising cookies",
        body: "We do not run advertising or cross-site tracking cookies, and we do not share browsing data with ad networks.",
      },
      {
        heading: "Controlling cookies",
        body: `Every major browser can block or delete cookies and clear local storage from its settings. Questions: ${BRAND.email}.`,
      },
    ],
  },
};
