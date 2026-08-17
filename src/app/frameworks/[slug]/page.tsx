import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/marshal/page-shell";
import { FRAMEWORK_PAGES, getFrameworkPage } from "@/lib/framework-content";
import { buildMetadata } from "@/lib/seo";

// Required for `output: export` — a dynamic segment with no generateStaticParams
// is silently dropped from the build rather than failing loudly.
export function generateStaticParams() {
  return FRAMEWORK_PAGES.map((p) => ({ slug: p.fact.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getFrameworkPage(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.title,
    description: p.description,
    path: `/frameworks/${p.fact.slug}`,
    keywords: p.keywords,
  });
}

export default async function FrameworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getFrameworkPage(slug);
  if (!p) notFound();

  const { fact } = p;

  return (
    <PageShell
      title={p.title}
      kicker={fact.authority}
      intro={p.intro}
      crumbs={[
        { name: "Frameworks", path: `/frameworks/${fact.slug}` },
        { name: fact.name, path: `/frameworks/${fact.slug}` },
      ]}
    >
      <dl className="border-marshal-divider grid grid-cols-2 gap-6 border-b py-8 md:grid-cols-4">
        {[
          { k: "Official name", v: fact.officialName },
          { k: "Authority", v: fact.authority },
          { k: "Region", v: fact.region },
          {
            // "—" rather than a number when the standard has no countable set,
            // so the page never invents a figure to fill the slot.
            k: fact.controlUnit,
            v: fact.controlCount === null ? "—" : String(fact.controlCount),
          },
        ].map((row) => (
          <div key={row.k}>
            <dt className="text-marshal-text/70 text-[11px] tracking-[0.06em] uppercase">{row.k}</dt>
            <dd className="text-marshal-text m-0 mt-1.5 text-sm leading-snug">{row.v}</dd>
          </div>
        ))}
      </dl>

      <section className="py-10">
        <h2 className="font-heading m-0 text-xl font-semibold">
          Automations that produce {fact.name} evidence
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {p.automations.map((a) => (
            <article
              key={a.name}
              className="border-marshal-neutral-800 bg-marshal-surface rounded-2xl border p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading m-0 text-sm font-semibold">{a.name}</h3>
                <span className="text-marshal-text/70 text-[11px] tracking-[0.05em] uppercase">
                  {a.cadence}
                </span>
              </div>
              <p className="text-marshal-text/70 mt-2 text-sm leading-relaxed">{a.what}</p>
              <p className="text-marshal-accent-300 mt-2 font-mono text-[11px]">{a.maps}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="border-marshal-divider text-marshal-text/70 border-t py-6 text-xs">
        Framework facts on this page are verified against{" "}
        <a
          href={fact.source}
          rel="noopener"
          target="_blank"
          className="text-marshal-accent-300 underline"
        >
          the primary source
        </a>
        . Automation counts and coverage claims are placeholder pending sign-off.
      </p>
    </PageShell>
  );
}
