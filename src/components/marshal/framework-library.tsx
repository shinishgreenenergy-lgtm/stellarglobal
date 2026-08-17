import { frameworks } from "@/lib/marshal-content";

export function FrameworkLibrary() {
  return (
    <section id="frameworks" className="border-marshal-divider border-t py-14">
      <h6 className="mb-3.5 text-marshal-accent-300">Framework library</h6>
      <h2 className="m-0 mb-8 max-w-[26ch] text-[clamp(26px,3vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] uppercase">
        Carry as many as the business needs
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {frameworks.map((fw) => (
          <div
            key={fw.name}
            className="flex flex-col gap-1.5 rounded-lg border border-marshal-neutral-800 bg-marshal-surface p-4"
          >
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="font-heading text-base font-semibold">{fw.name}</span>
              <span className="text-[11px] tracking-[0.06em] text-marshal-text/70 uppercase">{fw.status}</span>
            </div>
            <span className="text-[13px] leading-relaxed text-marshal-text/70">{fw.note}</span>
            <span className="text-[11.5px] text-marshal-accent-300">{fw.controls}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
