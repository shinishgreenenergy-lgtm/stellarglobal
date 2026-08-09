import { statBand } from "@/lib/marshal-content";

export function StatBand() {
  return (
    <section
      className="mt-14"
      style={{
        background:
          "linear-gradient(160deg, var(--color-marshal-section) 0%, var(--color-marshal-section-glow) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-5 py-14">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {statBand.map((s) => (
            <div key={s.label}>
              <p className="font-heading m-0 text-[44px] leading-[1.05] font-semibold tracking-[-0.02em]">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-marshal-text/75">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
