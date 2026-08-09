export function Hero() {
  return (
    <section data-hero className="relative pt-[88px] pb-[56px]">
      {/* Ambient glow — kept strictly inside the hero box per the handoff's
          explicit warning (a wider inset caused 349px of page overflow in the design). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 [inset:-140px_0_25%_10%]"
        style={{
          background:
            "radial-gradient(90% 75% at 78% 26%, color-mix(in srgb, var(--color-marshal-accent) 15%, transparent) 0%, transparent 74%)",
        }}
      />

      <span className="mb-7 inline-block rounded-sm border border-marshal-accent-800 px-2.5 py-1 text-xs tracking-[0.08em] text-marshal-accent-300 uppercase">
        Stellar GRC · NCA ECC · SAMA CSF · PDPL · ISO 27001
      </span>

      <h1 className="m-0 max-w-[18ch] text-[clamp(38px,5.6vw,72px)] leading-[1.04] font-extrabold tracking-[-0.025em] uppercase">
        Compliance that runs itself.
      </h1>

      <p className="mt-[22px] max-w-[62ch] text-lg leading-relaxed text-marshal-text/78">
        Marshal is the automation-first GRC platform from Stellar GRC.{" "}
        <strong className="font-semibold text-marshal-text">312 automations</strong> pull evidence from your
        cloud, identity, ticketing and HR systems, test every control on a schedule, map one result to every
        framework you carry, and raise the exception before the auditor does.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" className="btn-marshal-primary">
          Book a demo
        </button>
        <button type="button" className="btn-marshal-ghost">
          Browse the automation library
        </button>
      </div>

      <figure className="mt-[44px] overflow-hidden rounded-2xl border border-marshal-neutral-800 bg-marshal-surface">
        <div
          className="flex w-full items-center justify-center text-sm text-marshal-neutral-500"
          style={{ aspectRatio: "1200 / 588" }}
        >
          Marshal dashboard screenshot
        </div>
      </figure>
    </section>
  );
}
