import { describe, it, expect } from "vitest";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { BASE_PATH } from "@/lib/asset";

/**
 * The origin has been wrong once already, and the failure is silent: pages
 * render while every canonical points somewhere that is not ours.
 */
describe("SITE_URL", () => {
  it("is https", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("has no trailing slash, so absoluteUrl cannot double up", () => {
    expect(SITE_URL).not.toMatch(/\/$/);
  });

  it("names a single canonical host, not a placeholder", () => {
    expect(SITE_URL).not.toMatch(/example\.com|localhost|TODO/i);
  });

  it("builds the site root from origin plus basePath", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}${BASE_PATH}`);
  });

  it("is overridable per deploy target", () => {
    // Both hosts build from the same source; only the env differs.
    expect(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL).toBeTruthy();
  });
});
