import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/marshal/site-nav";
import { SiteFooter } from "@/components/marshal/site-footer";
import { JsonLd } from "@/components/marshal/json-ld";
import { breadcrumbLd } from "@/lib/structured-data";

type Crumb = { name: string; path: string };

/**
 * Chrome for every page that is not the home page: nav, breadcrumb, titled
 * header, content, footer. The breadcrumb is emitted twice on purpose — once
 * visibly for readers, once as BreadcrumbList JSON-LD for crawlers.
 */
export function PageShell({
  title,
  kicker,
  intro,
  crumbs,
  children,
}: {
  title: string;
  kicker?: string;
  intro?: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <div className="bg-marshal-bg text-marshal-text min-h-screen">
      <SiteNav />
      <JsonLd data={breadcrumbLd(trail)} />

      <div className="mx-auto max-w-[1240px] px-5">
        <nav aria-label="Breadcrumb" className="pt-8">
          <ol className="text-marshal-text/70 m-0 flex list-none flex-wrap gap-2 p-0 text-xs">
            {trail.map((c, i) => (
              <li key={`${c.path}-${i}`} className="flex items-center gap-2">
                {i < trail.length - 1 ? (
                  <>
                    <Link href={c.path} className="hover:text-marshal-accent-300 no-underline">
                      {c.name}
                    </Link>
                    <span aria-hidden>/</span>
                  </>
                ) : (
                  <span aria-current="page" className="text-marshal-text/80">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="border-marshal-divider border-b py-10">
          {kicker && (
            <p className="text-marshal-accent-300 m-0 mb-3 text-xs tracking-[0.08em] uppercase">
              {kicker}
            </p>
          )}
          <h1 className="font-heading m-0 max-w-[22ch] text-[clamp(30px,4.2vw,52px)] leading-[1.06] font-extrabold tracking-[-0.02em] uppercase">
            {title}
          </h1>
          {intro && (
            <p className="text-marshal-text/70 mt-5 max-w-[62ch] text-lg leading-relaxed">{intro}</p>
          )}
        </header>

        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
