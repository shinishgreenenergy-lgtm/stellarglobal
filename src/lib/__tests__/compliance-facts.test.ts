import { describe, it, expect } from "vitest";
import { FRAMEWORK_FACTS, UNVERIFIED_CLAIMS } from "@/lib/compliance-facts";
import { frameworks } from "@/lib/marshal-content";

describe("compliance facts", () => {
  it("cites a source for every verified fact", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(f.source, `${f.slug} has no source`).toMatch(/^https?:\/\//);
    }
  });

  it("gives every framework a unique slug", () => {
    const slugs = FRAMEWORK_FACTS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses kebab-case slugs safe for URLs", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(f.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("does not claim a control count that is also listed as unverified", () => {
    for (const f of FRAMEWORK_FACTS) {
      if (f.controlCount !== null) {
        expect(UNVERIFIED_CLAIMS).not.toContain(f.slug);
      }
    }
  });

  it("keeps the marketing framework list in step with the facts", () => {
    expect(frameworks.length).toBe(FRAMEWORK_FACTS.length);
  });

  it("publishes the same control count in the marketing list as in the facts", () => {
    for (const f of FRAMEWORK_FACTS) {
      if (f.controlCount === null) continue;
      const marketing = frameworks.find((m) => m.name === f.name);
      expect(marketing, `no marketing entry for ${f.name}`).toBeDefined();
      const claimed = marketing!.controls.match(/\d+/)?.[0];
      if (claimed) {
        expect(Number(claimed), `${f.name} count drifted from the verified fact`).toBe(
          f.controlCount
        );
      }
    }
  });
});
