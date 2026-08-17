import { describe, it, expect } from "vitest";
import { SITE_URL, absoluteUrl, buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

describe("absoluteUrl", () => {
  it("includes the basePath", () => {
    expect(absoluteUrl("/privacy")).toBe(`${SITE_URL}/stellarglobal/privacy`);
  });

  it("normalises a missing leading slash", () => {
    expect(absoluteUrl("privacy")).toBe(`${SITE_URL}/stellarglobal/privacy`);
  });

  it("maps the site root to the basePath root", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/stellarglobal`);
  });

  it("never emits a double slash", () => {
    for (const p of ["/", "//privacy", "privacy", "/compare/marshal-vs-vanta"]) {
      expect(absoluteUrl(p).replace(/^https?:\/\//, "")).not.toMatch(/\/\//);
    }
  });
});

describe("buildMetadata", () => {
  it("sets a canonical", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/privacy" });
    expect(m.alternates?.canonical).toBe(absoluteUrl("/privacy"));
  });

  it("sets OpenGraph and Twitter cards", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/privacy" });
    expect(m.openGraph?.url).toBe(absoluteUrl("/privacy"));
    expect(m.twitter).toBeDefined();
  });

  it("can mark a page noindex", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/x", noindex: true });
    expect(m.robots).toMatchObject({ index: false });
  });

  it("does not repeat the brand when the title already carries it", () => {
    const m = buildMetadata({ title: "Marshal vs Vanta", description: "D", path: "/x" });
    expect(String(m.title).match(/Marshal/g)).toHaveLength(1);
  });
});

describe("KEYWORDS", () => {
  it("has no duplicate terms within a page", () => {
    for (const [slug, terms] of Object.entries(KEYWORDS)) {
      expect(new Set(terms).size, `${slug} repeats a term`).toBe(terms.length);
    }
  });

  it("caps each page at 12 terms", () => {
    for (const [slug, terms] of Object.entries(KEYWORDS)) {
      expect(terms.length, `${slug} has too many`).toBeLessThanOrEqual(12);
    }
  });

  it("covers the home page", () => {
    expect(KEYWORDS.home.length).toBeGreaterThan(5);
  });
});
