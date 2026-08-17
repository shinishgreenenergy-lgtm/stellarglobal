import type { Metadata } from "next";
import { LegalPage } from "@/components/marshal/legal-page";
import { LEGAL_PAGES } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

const page = LEGAL_PAGES.privacy;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.intro,
  path: "/privacy",
  keywords: KEYWORDS.privacy,
});

export default function PrivacyPage() {
  return <LegalPage page={page} path="/privacy" />;
}
