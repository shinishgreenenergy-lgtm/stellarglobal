import type { Metadata } from "next";
import { LegalPage } from "@/components/marshal/legal-page";
import { LEGAL_PAGES } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

const page = LEGAL_PAGES.terms;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.intro,
  path: "/terms",
  keywords: KEYWORDS.terms,
});

export default function TermsPage() {
  return <LegalPage page={page} path="/terms" />;
}
