import type { Metadata } from "next";
import { SiteNav } from "@/components/marshal/site-nav";
import { JsonLd } from "@/components/marshal/json-ld";
import { organizationLd, softwareApplicationLd, faqPageLd } from "@/lib/structured-data";
import { faqs } from "@/lib/marshal-content";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";
import { BRAND } from "@/lib/brand";
import { Hero } from "@/components/marshal/hero";
import { IntegrationsStrip } from "@/components/marshal/integrations-strip";
import { StatBand } from "@/components/marshal/stat-band";
import { AutomationLibrary } from "@/components/marshal/automation-library";
import { AnatomyPipeline } from "@/components/marshal/anatomy-pipeline";
import { PlatformDisciplines } from "@/components/marshal/platform-disciplines";
import { FrameworkLibrary } from "@/components/marshal/framework-library";
import { Testimonials } from "@/components/marshal/testimonials";
import { Faq } from "@/components/marshal/faq";
import { SwitchingAndAssessment } from "@/components/marshal/switching-and-assessment";
import { ClosingCta } from "@/components/marshal/closing-cta";
import { SiteFooter } from "@/components/marshal/site-footer";

// Both content sections are on by default per the design's showTestimonials/
// showFaq props (default true) — kept as simple constants here per the
// handoff's guidance to "port as CMS booleans or drop them".
const SHOW_TESTIMONIALS = true;
const SHOW_FAQ = true;

export const metadata: Metadata = buildMetadata({
  title: `${BRAND.product} — ${BRAND.tagline}`,
  description: `${BRAND.product} is ${BRAND.descriptor} from ${BRAND.company}. It pulls evidence from your cloud, identity and HR systems, tests every control on a schedule, and maps one result to every framework.`,
  path: "/",
  keywords: KEYWORDS.home,
});

export default function MarshalPage() {
  return (
    <div className="bg-marshal-bg text-marshal-text">
      <JsonLd data={organizationLd()} />
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={faqPageLd(faqs)} />

      <SiteNav />

      <div className="mx-auto max-w-[1240px] px-5">
        <Hero />
        <IntegrationsStrip />
      </div>

      <StatBand />

      <div className="mx-auto max-w-[1240px] px-5">
        <AutomationLibrary />
        <AnatomyPipeline />
        <PlatformDisciplines />
        <FrameworkLibrary />
        {SHOW_TESTIMONIALS && <Testimonials />}
        {SHOW_FAQ && <Faq />}
        <SwitchingAndAssessment />
        <ClosingCta />
        <SiteFooter />
      </div>
    </div>
  );
}
