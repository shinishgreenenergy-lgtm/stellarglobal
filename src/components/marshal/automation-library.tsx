import { automationGroups } from "@/lib/marshal-content";

export function AutomationLibrary() {
  return (
    <>
      <section id="automations" className="pt-[72px] pb-6">
        <h6 className="mb-3.5 text-marshal-accent-300">The automation library</h6>
        <h2 className="m-0 max-w-[24ch] text-[clamp(28px,3.4vw,44px)] leading-[1.08] font-bold tracking-[-0.02em] uppercase">
          Every control has a robot behind it
        </h2>
        <p className="mt-4.5 max-w-[64ch] text-base leading-relaxed text-marshal-text/75">
          Each automation is a trigger, a test and a filed result. They run on their own cadence, write
          timestamped evidence into the control record, and open a task on the owner when the test fails.
          Nothing here needs a screenshot.
        </p>
      </section>

      {automationGroups.map((group) => (
        <section key={group.name} className="border-marshal-divider border-t py-8.5">
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[260px_1fr] lg:gap-x-10">
            <div className="lg:sticky lg:top-[84px]">
              <h3 className="m-0 text-[22px] tracking-[-0.015em]">{group.name}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-marshal-text/60">{group.note}</p>
              <p className="mt-3.5 text-xs tracking-[0.06em] text-marshal-accent-300 uppercase">{group.count}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.items.map((a) => (
                <div
                  key={a.name}
                  className="flex flex-col gap-2 rounded-lg border border-marshal-neutral-800 bg-marshal-surface p-4 pb-3.5 transition-colors duration-[180ms] hover:border-marshal-accent-700 hover:bg-marshal-neutral-900"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-heading text-[15px] font-semibold tracking-[-0.01em]">{a.name}</span>
                    <span className="text-[11px] tracking-[0.06em] whitespace-nowrap text-marshal-accent-300 uppercase">
                      {a.cadence}
                    </span>
                  </div>
                  <span className="text-[13px] leading-relaxed text-marshal-text/70">{a.what}</span>
                  <span className="border-marshal-divider border-t pt-2 text-[11.5px] tracking-[0.03em] text-marshal-text/50">
                    {a.maps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
