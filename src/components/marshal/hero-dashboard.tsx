import { Check } from "lucide-react";
import { heroRun } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

export function HeroDashboard() {
  return (
    <figure
      aria-label={`${BRAND.product} run detail: one ${heroRun.automation} test cleared ${heroRun.cleared.length} frameworks`}
      className="border-marshal-neutral-800 bg-marshal-surface m-0 overflow-hidden rounded-2xl border"
    >
      <div className="border-marshal-divider flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <span className="text-marshal-text/70 text-xs">
          {BRAND.product} <span aria-hidden>›</span> Automations <span aria-hidden>›</span>{" "}
          <span className="text-marshal-text/85">{heroRun.automation}</span>
        </span>
        <span className="text-marshal-text/70 hidden text-[11px] tracking-[0.06em] uppercase sm:inline">
          Read-only · {heroRun.cadence}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[38fr_62fr] md:[aspect-ratio:1200/540]">
        <div className="border-marshal-divider flex flex-col gap-4 border-b p-5 md:border-r md:border-b-0">
          <span className="border-marshal-accent-800 text-marshal-accent-300 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase">
            <span className="bg-marshal-accent size-1.5 rounded-full" aria-hidden />
            {heroRun.status} · {heroRun.ranAt}
          </span>

          <div>
            <p className="font-heading text-marshal-text m-0 text-lg font-semibold">
              {heroRun.automation}
            </p>
            <p className="text-marshal-text/70 m-0 mt-1 text-sm">{heroRun.cadence}</p>
          </div>

          <dl className="mt-auto grid grid-cols-2 gap-4">
            {heroRun.counters.map((c) => (
              <div key={c.label} className="flex flex-col-reverse">
                <dt className="text-marshal-text/70 text-xs leading-snug">{c.label}</dt>
                <dd className="font-heading text-marshal-text m-0 text-2xl font-bold">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col p-5">
          <p className="text-marshal-text/70 m-0 mb-3 text-[11px] tracking-[0.08em] uppercase">
            Cleared this run
          </p>

          <ul className="m-0 flex list-none flex-col gap-px p-0">
            {heroRun.cleared.map((clause, i) => (
              <li
                key={clause.framework}
                data-clause-row
                style={{ animationDelay: `${i * 90}ms` }}
                className="animate-clause-in hover:bg-marshal-neutral-900 flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors"
              >
                <span className="text-marshal-text text-sm">{clause.framework}</span>
                <span className="flex items-center gap-2.5">
                  <span className="text-marshal-text/70 font-mono text-xs">{clause.reference}</span>
                  <Check className="text-marshal-accent-300 size-3.5" aria-hidden />
                </span>
              </li>
            ))}
          </ul>

          <p className="border-marshal-divider text-marshal-text/70 mt-auto border-t pt-3 text-xs">
            One test · {heroRun.cleared.length} frameworks · evidence filed automatically
          </p>
        </div>
      </div>
    </figure>
  );
}
