import { PageShell } from "@/components/marshal/page-shell";
import type { LegalPage as LegalPageData } from "@/lib/legal-content";

/**
 * Shared body for the three legal pages. Identical structure, so the pages
 * themselves only supply data and metadata.
 */
export function LegalPage({ page, path }: { page: LegalPageData; path: string }) {
  return (
    <PageShell
      title={page.title}
      kicker="Legal"
      intro={page.intro}
      crumbs={[{ name: page.title, path }]}
    >
      {!page.reviewed && (
        <p
          role="note"
          className="border-marshal-accent-800 bg-marshal-section text-marshal-accent-200 mt-8 rounded-xl border px-4 py-3 text-sm"
        >
          Draft awaiting legal review — not yet a binding policy.
        </p>
      )}

      <div className="max-w-[70ch] py-10">
        <p className="text-marshal-text/70 m-0 text-xs tracking-[0.06em] uppercase">
          Last updated {page.updated}
        </p>
        {page.sections.map((s) => (
          <section key={s.heading} className="mt-9">
            <h2 className="font-heading m-0 text-xl font-semibold">{s.heading}</h2>
            <p className="text-marshal-text/70 mt-2.5 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
