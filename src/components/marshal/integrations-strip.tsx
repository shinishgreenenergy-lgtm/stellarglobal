import { integrations } from "@/lib/marshal-content";
import { LogoMarquee } from "@/components/marshal/logo-marquee";

export function IntegrationsStrip() {
  return (
    // "Integrations" rather than "Connected systems": the marquee's own list
    // already carries that name, and two identical landmarks are confusing.
    <section aria-label="Integrations" className="border-marshal-divider border-t border-b py-10">
      <p className="text-marshal-text/70 mb-[18px] text-xs tracking-[0.08em] uppercase">
        Evidence collected automatically from
      </p>
      <LogoMarquee items={integrations} />
    </section>
  );
}
