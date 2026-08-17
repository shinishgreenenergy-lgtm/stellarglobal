/**
 * Single source of truth for brand naming.
 *
 * The site shipped as "Stellar GRC"; the owner confirmed the company is
 * "Stellar Global". Changing `company` here renames it everywhere — no
 * component hardcodes either string.
 */
export const BRAND = {
  company: "Stellar Global",
  product: "Marshal",
  productFull: "Marshal by Stellar Global",
  tagline: "Compliance that runs itself.",
  descriptor: "the automation-first GRC platform",
  email: "hello@stellarglobal.com",
  locales: ["en", "ar"] as const,
} as const;
