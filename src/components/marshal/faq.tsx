"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/marshal-content";

export function Faq() {
  return (
    <section id="faq" className="border-marshal-divider border-t py-14">
      <h6 className="mb-3.5 text-marshal-accent-300">Questions</h6>
      <h2 className="m-0 mb-7 text-[clamp(26px,3vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] uppercase">
        What teams ask before switching
      </h2>
      {/* multiple: every question can be open independently, matching the
          native <details>-per-row behavior in the original design. */}
      <Accordion multiple className="gap-0">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-marshal-divider border-t not-last:border-b-0 py-4">
            <AccordionTrigger className="group/faq rounded-none border-0 p-0 hover:no-underline focus-visible:border-0 focus-visible:ring-0">
              <span className="font-heading flex-1 text-left text-[17px] font-medium">{f.q}</span>
              <span
                aria-hidden
                className="ml-auto text-xl leading-none text-marshal-accent-300 transition-transform duration-200 group-aria-expanded/faq:rotate-45"
              >
                +
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-marshal-text/72">
              <p className="m-0 max-w-[74ch] pt-3 text-[14.5px] leading-relaxed">{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
