import { disciplines } from "@/lib/marshal-content";

export function PlatformDisciplines() {
  return (
    <section id="platform" className="border-marshal-divider border-t py-14">
      <h6 className="mb-3.5 text-marshal-accent-300">The platform</h6>
      <h2 className="m-0 mb-2.5 max-w-[26ch] text-[clamp(26px,3vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] uppercase">
        One platform, four disciplines
      </h2>
      <p className="m-0 mb-8 max-w-[62ch] text-base leading-relaxed text-marshal-text/75">
        Evidence collected once counts toward every framework it satisfies — the unified control set removes
        the duplicate work that defines spreadsheet GRC.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {disciplines.map((d) => (
          <div
            key={d.kicker}
            className="flex flex-col gap-2.5 rounded-lg border border-marshal-neutral-800 bg-marshal-surface p-5"
          >
            <span className="text-xs tracking-[0.06em] text-marshal-accent-300 uppercase">{d.kicker}</span>
            <span className="font-heading text-[19px] font-semibold">{d.title}</span>
            <span className="text-[13.5px] leading-relaxed text-marshal-text/70">{d.body}</span>
            <span className="mt-auto pt-2.5 text-sm text-marshal-accent-300">{d.autos}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
