import { describe, it, expect } from "vitest";
import { compareSlug, COMPARISONS, getComparison } from "@/lib/compare-content";
import { compareMenu } from "@/lib/marshal-content";

describe("compareSlug", () => {
  it("kebab-cases a menu label", () => {
    expect(compareSlug("Marshal vs Vanta")).toBe("marshal-vs-vanta");
  });

  it("handles multi-word competitors", () => {
    expect(compareSlug("Marshal vs GRC Vantage")).toBe("marshal-vs-grc-vantage");
  });

  it("handles the framework-vs-framework entry", () => {
    expect(compareSlug("NCA ECC vs SAMA CSF")).toBe("nca-ecc-vs-sama-csf");
  });
});

describe("COMPARISONS", () => {
  it("covers every vendor entry in the menu", () => {
    const vendorLabels = compareMenu.filter((l) => /^Marshal vs /i.test(l));
    expect(COMPARISONS).toHaveLength(vendorLabels.length);
    for (const label of vendorLabels) {
      expect(getComparison(compareSlug(label)), `${label} has no page`).toBeDefined();
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getComparison("marshal-vs-nothing")).toBeUndefined();
  });

  it("gives every page a unique slug, title and description", () => {
    for (const key of ["slug", "title", "description"] as const) {
      const values = COMPARISONS.map((c) => c[key]);
      expect(new Set(values).size, `${key} is not unique`).toBe(values.length);
    }
  });

  it("never states a competitor claim without a source", () => {
    for (const c of COMPARISONS) {
      for (const row of c.rows) {
        if (row.competitor) {
          expect(row.source, `${c.slug}/${row.dimension} claims without a source`).toMatch(
            /^https?:\/\//
          );
          expect(row.checked, `${c.slug}/${row.dimension} has no check date`).toMatch(
            /^\d{4}-\d{2}-\d{2}$/
          );
        }
      }
    }
  });

  it("stays out of the index until competitor columns are sourced", () => {
    for (const c of COMPARISONS) {
      const everyRowSourced = c.rows.every((r) => r.competitor && r.source);
      if (!everyRowSourced) {
        expect(c.indexed, `${c.slug} is indexed but not fully sourced`).toBe(false);
      }
    }
  });

  it("states Marshal's own position on every row", () => {
    for (const c of COMPARISONS) {
      expect(c.rows.length).toBeGreaterThan(3);
      for (const row of c.rows) {
        expect(row.marshal.length, `${c.slug}/${row.dimension}`).toBeGreaterThan(30);
        expect(row.verify.length, `${c.slug}/${row.dimension}`).toBeGreaterThan(30);
      }
    }
  });
});
