"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { products, frameworksMenu, compareMenu } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

const navLinks = [
  { href: "#automations", label: "Automations", current: true },
  { href: "#platform", label: "Platform" },
  { href: "#frameworks", label: "Frameworks" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  // Esc closes the mega menu regardless of focus location, matching the
  // spec's "implement keyboard support (Esc closes)" requirement.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      className="sticky top-0 z-30 flex items-center justify-between gap-6 px-5 py-4 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--color-marshal-bg) 92%, transparent)" }}
    >
      <span className="font-heading text-sm font-semibold tracking-tight text-marshal-text">
        {BRAND.company}
      </span>

      <div className="hidden flex-1 items-center gap-7 md:flex">
        {/* Mega menu trigger + panel — hover/focus-within driven via group, no JS needed to open */}
        <div
          ref={megaRef}
          className="group relative"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-marshal-text/80 transition-colors hover:text-marshal-accent hover:opacity-100 focus-visible:text-marshal-accent"
            aria-expanded={megaOpen}
          >
            Products
            <ChevronDown
              className="size-3 transition-transform duration-[180ms] group-hover:rotate-180 group-focus-within:rotate-180"
              aria-hidden
            />
          </button>

          <div
            data-open={megaOpen || undefined}
            className="pointer-events-none invisible fixed top-[66px] left-5 right-5 mx-auto w-[min(980px,calc(100vw-40px))] -translate-y-1.5 rounded-2xl border border-marshal-neutral-800 bg-marshal-surface p-5 opacity-0 shadow-[var(--shadow-marshal-lg)] transition-[opacity,transform,visibility] duration-[180ms] ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            {/* Invisible bridge keeps the hover chain alive across the gap to the nav */}
            <div className="absolute -top-[22px] left-0 right-0 h-[22px]" aria-hidden />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <p className="mb-2 text-[11px] tracking-[0.08em] text-marshal-text/50 uppercase">Modules</p>
                <div className="grid grid-cols-2 gap-0.5">
                  {products.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      className="flex flex-col gap-0.5 rounded-lg p-2.5 no-underline transition-colors hover:bg-marshal-neutral-900"
                    >
                      <span className="font-heading text-sm font-semibold text-marshal-text">{p.name}</span>
                      <span className="text-xs leading-snug text-marshal-text/60">{p.note}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-marshal-divider border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <p className="mb-2 text-[11px] tracking-[0.08em] text-marshal-text/50 uppercase">Frameworks</p>
                <div className="flex flex-col gap-px">
                  {frameworksMenu.map((f) => (
                    <a
                      key={f.name}
                      href="#frameworks"
                      className="flex items-baseline justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-marshal-text no-underline transition-colors hover:bg-marshal-neutral-900"
                    >
                      <span>{f.name}</span>
                      <span className="text-[10.5px] tracking-[0.05em] text-marshal-text/48 uppercase">{f.meta}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-marshal-divider border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <p className="mb-2 text-[11px] tracking-[0.08em] text-marshal-text/50 uppercase">Compare</p>
                <div className="flex flex-col gap-px">
                  {compareMenu.map((c) => (
                    <a
                      key={c}
                      href="#faq"
                      className="rounded-lg px-2.5 py-1.5 text-sm text-marshal-text no-underline transition-colors hover:bg-marshal-neutral-900"
                    >
                      {c}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-marshal-divider mt-3.5 flex flex-wrap items-center justify-between gap-4 border-t pt-3">
              <span className="text-[12.5px] text-marshal-text/60">
                312 automations across every module · ISO 27005 methodology · Arabic and English.
              </span>
              <a href="#automations" className="text-[12.5px]">
                Browse the library →
              </a>
            </div>
          </div>
        </div>

        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            aria-current={l.current ? "location" : undefined}
            className="text-sm text-marshal-text/80 no-underline transition-colors hover:text-marshal-accent aria-[current=location]:text-marshal-accent"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="btn-marshal-primary hidden sm:inline-flex">
          Book a demo
        </button>
        <button
          type="button"
          className="text-marshal-text md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer — same items as the desktop mega menu, per the handoff's note
          that mobile nav is out of scope of the design but should reuse the items. */}
      {mobileOpen && (
        <div className="bg-marshal-bg border-marshal-divider absolute top-full right-0 left-0 flex flex-col gap-1 border-t p-5 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-2.5 text-sm text-marshal-text no-underline"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <p className="mt-2 px-2 text-[11px] tracking-[0.08em] text-marshal-text/50 uppercase">Modules</p>
          {products.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="rounded-lg px-2 py-2 text-sm text-marshal-text no-underline"
              onClick={() => setMobileOpen(false)}
            >
              {p.name}
            </a>
          ))}
          <button type="button" className="btn-marshal-primary mt-3 w-full sm:hidden">
            Book a demo
          </button>
        </div>
      )}
    </nav>
  );
}
