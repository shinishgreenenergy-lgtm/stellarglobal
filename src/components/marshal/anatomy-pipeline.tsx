import { pipeline } from "@/lib/marshal-content";

export function AnatomyPipeline() {
  return (
    <section className="border-marshal-divider border-t py-14">
      <h6 className="mb-3.5 text-marshal-accent-300">Anatomy of an automation</h6>
      <h2 className="m-0 mb-8 max-w-[26ch] text-[clamp(26px,3vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] uppercase">
        Connect once. It never stops running.
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pipeline.map((step) => (
          <div key={step.n} className="rounded-lg border border-marshal-neutral-800 bg-marshal-surface p-5">
            <span className="text-xs tracking-[0.08em] text-marshal-accent-300">{step.n}</span>
            <h4 className="mt-2.5 mb-2 text-lg tracking-[-0.01em]">{step.title}</h4>
            <p className="m-0 text-[13.5px] leading-relaxed text-marshal-text/70">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
