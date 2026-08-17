import type { Metadata } from "next";
import { LegalPage } from "@/components/marshal/legal-page";
import { LEGAL_PAGES } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

const page = LEGAL_PAGES.cookies;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.intro,
  path: "/cookies",
  keywords: KEYWORDS.cookies,
});

export default function CookiesPage() {
  return <LegalPage page={page} path="/cookies" />;
}
