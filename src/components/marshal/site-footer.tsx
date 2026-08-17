import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { StellarGlobalWordmark } from "@/components/marshal/brand-logo";
import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";

const legalLinks = [
  { href: "/security", label: "Security" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="border-marshal-divider text-marshal-text/70 border-t py-10 pb-14 text-[12.5px]">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-3">
          <span className="flex flex-wrap items-center gap-2.5">
            {BRAND.product} is a product of
            <StellarGlobalWordmark />
          </span>
          <span>Riyadh · Dammam · Dubai</span>
        </div>

        <nav aria-label="Frameworks">
          <p className="text-marshal-text/70 m-0 mb-2.5 text-[11px] tracking-[0.08em] uppercase">
            Frameworks
          </p>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1 p-0">
            {FRAMEWORK_FACTS.slice(0, 8).map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/frameworks/${f.slug}`}
                  className="hover:text-marshal-accent-300 no-underline transition-colors"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-marshal-text/70 m-0 mb-2.5 text-[11px] tracking-[0.08em] uppercase">
            Company
          </p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-marshal-accent-300 no-underline transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
