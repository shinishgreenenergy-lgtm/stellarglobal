import { describe, it, expect } from "vitest";
import { FRAMEWORK_PAGES, getFrameworkPage } from "@/lib/framework-content";
import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";

describe("framework pages", () => {
  it("builds one page per verified framework", () => {
    expect(FRAMEWORK_PAGES).toHaveLength(FRAMEWORK_FACTS.length);
  });

  it("resolves by slug", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(getFrameworkPage(f.slug)?.fact.slug).toBe(f.slug);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getFrameworkPage("not-a-framework")).toBeUndefined();
  });

  it("keeps every description inside the SERP snippet budget", () => {
    for (const p of FRAMEWORK_PAGES) {
      expect(p.description.length, `${p.fact.slug}: ${p.description.length} chars`).toBeGreaterThanOrEqual(70);
      expect(p.description.length, `${p.fact.slug}: ${p.description.length} chars`).toBeLessThanOrEqual(160);
    }
  });

  it("never prints a control count for a framework without one", () => {
    for (const p of FRAMEWORK_PAGES) {
      if (p.fact.controlCount === null) {
        expect(p.description).not.toMatch(/\d+\s+(controls|requirements|criteria)/);
      }
    }
  });

  it("lists at least one relevant automation per framework", () => {
    for (const p of FRAMEWORK_PAGES) {
      expect(p.automations.length, `${p.fact.slug} has no automations`).toBeGreaterThan(0);
    }
  });

  it("gives every page a unique title", () => {
    const titles = FRAMEWORK_PAGES.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
