import { integrations } from "@/lib/marshal-content";

export function IntegrationsStrip() {
  return (
    <section
      aria-label="Connected systems"
      className="border-marshal-divider border-t border-b py-10"
    >
      <p className="mb-[18px] text-xs tracking-[0.08em] text-marshal-text/55 uppercase">
        Evidence collected automatically from
      </p>
      <div className="flex flex-wrap gap-x-2 gap-y-2.5">
        {integrations.map((sys) => (
          <span
            key={sys}
            className="rounded-lg border border-marshal-neutral-800 px-[11px] py-[5px] text-sm text-marshal-text/80"
          >
            {sys}
          </span>
        ))}
      </div>
    </section>
  );
}
