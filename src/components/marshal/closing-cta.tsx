"use client";

import { useState, type FormEvent } from "react";
import { BRAND } from "@/lib/brand";

type FormState = "idle" | "loading" | "success" | "error";

// NOTE: no real submission endpoint was specified in the design handoff — this
// validates the email and simulates a request. Wire `action` up to the real
// lead-capture endpoint when one exists.
async function submitDemoRequest(email: string, framework: string) {
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, email, framework };
}

export function ClosingCta() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("marshal-email") as HTMLInputElement).value;
    const framework = (form.elements.namedItem("marshal-fw") as HTMLInputElement).value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid work email.");
      setState("error");
      return;
    }

    setError(null);
    setState("loading");
    try {
      const res = await submitDemoRequest(email, framework);
      if (!res.ok) throw new Error();
      setState("success");
      form.reset();
    } catch {
      setError("Something went wrong — try again.");
      setState("error");
    }
  }

  return (
    <section className="border-marshal-divider grid grid-cols-1 items-end gap-8 border-t py-16 pb-[72px] lg:grid-cols-[1fr_380px] lg:gap-12">
      <div>
        <h2 className="m-0 max-w-[20ch] text-[clamp(28px,3.6vw,46px)] leading-[1.06] font-bold tracking-[-0.025em]">
          Stop preparing for audits. Start passing them.
        </h2>
        <p className="mt-4.5 max-w-[56ch] text-base leading-relaxed text-marshal-text/75">
          Thirty minutes with the {BRAND.company} team in Riyadh, on your own control set — we turn on the
          automations against a sandbox tenant and show you what fails.
        </p>
      </div>

      {state === "success" ? (
        <div className="rounded-2xl border border-marshal-accent-800 bg-marshal-surface p-5 text-sm text-marshal-text">
          Thanks — we&rsquo;ll be in touch to schedule your demo.
        </div>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="marshal-email" className="text-xs text-marshal-text/70">
              Work email
            </label>
            <input
              className="input-marshal"
              id="marshal-email"
              name="marshal-email"
              type="email"
              placeholder="name@company.sa"
              required
              disabled={state === "loading"}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="marshal-fw" className="text-xs text-marshal-text/70">
              Framework you need first
            </label>
            <input
              className="input-marshal"
              id="marshal-fw"
              name="marshal-fw"
              type="text"
              placeholder="NCA ECC, SAMA CSF, ISO 27001…"
              disabled={state === "loading"}
            />
          </div>
          {state === "error" && error && (
            <p role="alert" className="m-0 text-xs text-red-400">
              {error}
            </p>
          )}
          <button type="submit" className="btn-marshal-primary w-full" disabled={state === "loading"}>
            {state === "loading" ? "Sending…" : "Book a demo"}
          </button>
        </form>
      )}
    </section>
  );
}
