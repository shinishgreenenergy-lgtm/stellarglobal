import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/marshal/page-shell";
import { COMPARISONS, getComparison } from "@/lib/compare-content";
import { buildMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return buildMetadata({
    title: c.title,
    description: c.description,
    path: `/compare/${c.slug}`,
    keywords: c.keywords,
    // Thin until the competitor column is sourced — see compare-content.ts.
    noindex: !c.indexed,
  });
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  return (
    <PageShell
      title={c.title}
      kicker="Compare"
      intro={c.intro}
      crumbs={[
        { name: "Compare", path: `/compare/${c.slug}` },
        { name: c.label, path: `/compare/${c.slug}` },
      ]}
    >
      <p
        role="note"
        className="border-marshal-accent-800 bg-marshal-section text-marshal-accent-200 mt-8 rounded-xl border px-4 py-3 text-sm"
      >
        This page states {BRAND.product}&rsquo;s own position only. We do not characterise{" "}
        {c.competitor}&rsquo;s product second-hand
        {c.competitorSite ? (
          <>
            {" — "}
            check{" "}
            <a
              href={c.competitorSite}
              rel="nofollow noopener"
              target="_blank"
              className="underline"
            >
              their documentation
            </a>{" "}
            directly
          </>
        ) : null}
        .
      </p>

      <div className="overflow-x-auto py-10">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <caption className="text-marshal-text/70 mb-3 text-left text-xs">
            Questions worth asking on each dimension, and where {BRAND.product} stands.
          </caption>
          <thead>
            <tr className="border-marshal-divider border-b text-left">
              <th scope="col" className="w-[22%] py-2.5 pr-4 font-semibold">
                Dimension
              </th>
              <th scope="col" className="w-[39%] py-2.5 pr-4 font-semibold">
                {BRAND.product}
              </th>
              <th scope="col" className="w-[39%] py-2.5 font-semibold">
                What to confirm with {c.competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.dimension} className="border-marshal-divider border-b align-top">
                <th scope="row" className="text-marshal-text/80 py-3.5 pr-4 text-left font-medium">
                  {r.dimension}
                </th>
                <td className="text-marshal-text/80 py-3.5 pr-4 leading-relaxed">{r.marshal}</td>
                <td className="text-marshal-text/70 py-3.5 leading-relaxed">
                  {r.competitor ?? r.verify}
                  {r.source && (
                    <a
                      href={r.source}
                      rel="nofollow noopener"
                      target="_blank"
                      className="text-marshal-text/70 mt-1 block text-[11px] underline"
                    >
                      Source, checked {r.checked}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
