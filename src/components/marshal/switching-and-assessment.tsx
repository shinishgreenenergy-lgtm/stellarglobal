import { migration } from "@/lib/marshal-content";

export function SwitchingAndAssessment() {
  return (
    <section className="border-marshal-divider grid grid-cols-1 items-start gap-8 border-t py-14 lg:grid-cols-2 lg:gap-12">
      <div>
        <h6 className="mb-3.5 text-marshal-accent-300">Switching platforms</h6>
        <h2 className="m-0 mb-3.5 text-[clamp(24px,2.6vw,34px)] leading-[1.1] font-bold tracking-[-0.02em]">
          Bring the programme with you
        </h2>
        <p className="m-0 mb-4.5 text-[15px] leading-relaxed text-marshal-text/72">
          Teams arrive from Vanta, Drata, Sprinto, Secureframe, OneTrust, Cyber Arrow and a decade of
          spreadsheets. Migration is a guided import, not a restart — history intact, so your next audit still
          sees continuous evidence.
        </p>
        <div className="flex flex-col gap-2.5">
          {migration.map((m) => (
            <div key={m} className="flex items-baseline gap-2.5">
              <span className="mt-[-2px] size-[5px] flex-none bg-marshal-accent" aria-hidden />
              <span className="text-sm leading-relaxed text-marshal-text/78">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border border-marshal-accent-800 p-6"
        style={{
          background:
            "linear-gradient(150deg, var(--color-marshal-section) 0%, var(--color-marshal-surface) 100%)",
        }}
      >
        <h6 className="mb-3 text-marshal-accent-300">Free · no signup</h6>
        <h3 className="m-0 mb-2.5 text-2xl tracking-[-0.02em]">Run a readiness assessment</h3>
        <p className="m-0 mb-4.5 text-[14.5px] leading-relaxed text-marshal-text/75">
          Answer the control questionnaire for NCA ECC, SAMA CSF, ISO 27001, SOC 2 or PDPL and get an instant
          maturity score with a prioritised remediation roadmap — before you talk to anyone.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn-marshal-primary">
            Start the assessment
          </button>
          <button type="button" className="btn-marshal-ghost">
            Download the audit checklist
          </button>
        </div>
      </div>
    </section>
  );
}
