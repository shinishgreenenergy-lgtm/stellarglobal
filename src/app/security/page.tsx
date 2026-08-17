import type { Metadata } from "next";
import { PageShell } from "@/components/marshal/page-shell";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: `Security at ${BRAND.company}`,
  description: `How ${BRAND.product} is built, hosted and monitored: access model, encryption, tenant isolation, monitoring and vulnerability disclosure.`,
  path: "/security",
  keywords: KEYWORDS.security,
});

const practices = [
  {
    heading: "Access model",
    body: `${BRAND.product} connects to customer systems read-only. Cloud connectors use a role scoped to configuration and log metadata; identity connectors read directory state and never credentials. Nothing is written back to production and no agent runs on customer workloads.`,
  },
  {
    heading: "Encryption",
    body: "Data is encrypted in transit with TLS 1.2 or better, and at rest with AES-256. Connector secrets are held in a managed key vault with rotation and are never written to logs.",
  },
  {
    heading: "Tenant isolation",
    body: "Each customer tenant is logically isolated. Authorisation is checked per request against the tenant on the credential, never against a client-supplied identifier.",
  },
  {
    heading: "Monitoring and response",
    body: "Platform and infrastructure logs are centralised and retained. Alerts route to an on-call rotation with a documented incident process covering triage, customer notification and post-incident review.",
  },
  {
    heading: "Personnel",
    body: "Access to production follows least privilege and is reviewed on a schedule. Staff complete security training on joining and annually, and are screened where local law allows.",
  },
  {
    heading: "Vulnerability disclosure",
    body: `Report a suspected vulnerability to ${BRAND.email}. We acknowledge within two business days and will not pursue action against good-faith research that respects customer data and avoids degrading the service.`,
  },
];

export default function SecurityPage() {
  return (
    <PageShell
      title="Security and trust"
      kicker="Trust"
      intro={`${BRAND.product} sits next to the systems that run your business. This page states plainly how it is built, what it can reach, and what it cannot.`}
      crumbs={[{ name: "Security", path: "/security" }]}
    >
      <div className="grid gap-5 py-10 md:grid-cols-2">
        {practices.map((p) => (
          <section
            key={p.heading}
            className="border-marshal-neutral-800 bg-marshal-surface rounded-2xl border p-5"
          >
            <h2 className="font-heading m-0 text-lg font-semibold">{p.heading}</h2>
            <p className="text-marshal-text/70 mt-2 text-sm leading-relaxed">{p.body}</p>
          </section>
        ))}
      </div>

      {/*
        No certifications are listed. Buyers hold vendors to this page during
        procurement, so a badge goes up when the report exists and not before.
      */}
      <section className="border-marshal-divider border-t py-10">
        <h2 className="font-heading m-0 text-xl font-semibold">Certifications</h2>
        <p className="text-marshal-text/70 mt-2.5 max-w-[62ch] leading-relaxed">
          Certification status is published here once each report or certificate is issued. Nothing
          is listed before it exists — ask and we will tell you exactly where we are. Requests:{" "}
          <a href={`mailto:${BRAND.email}`} className="text-marshal-accent-300 underline">
            {BRAND.email}
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
