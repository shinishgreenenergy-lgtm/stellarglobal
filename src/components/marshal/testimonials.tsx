import { quotes } from "@/lib/marshal-content";

export function Testimonials() {
  return (
    <section className="border-marshal-divider border-t py-14">
      <h6 className="mb-8 text-marshal-accent-300">From the programmes running on Marshal</h6>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q) => (
          <figure
            key={q.who}
            className="m-0 flex flex-col gap-4 rounded-lg border border-marshal-neutral-800 bg-marshal-surface p-5.5"
          >
            <blockquote className="m-0 text-[15.5px] leading-relaxed">{q.text}</blockquote>
            <figcaption className="mt-auto text-[12.5px] text-marshal-text/60">{q.who}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
