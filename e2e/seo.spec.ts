import { test, expect } from "@playwright/test";
import { url } from "./helpers";
import { ALL_ROUTES } from "../src/lib/routes";

test.describe("per-route metadata", () => {
  for (const route of ALL_ROUTES) {
    test(`${route.path} has complete SEO metadata`, async ({ page }) => {
      const res = await page.goto(url(route.path));
      expect(res?.status(), `${route.path} should exist`).toBeLessThan(400);

      const title = await page.title();
      expect(title.length, `title too short: "${title}"`).toBeGreaterThan(15);
      expect(title.length, `title too long: "${title}"`).toBeLessThanOrEqual(75);

      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc, `${route.path} has no description`).toBeTruthy();
      expect(desc!.length, `description ${desc!.length} chars`).toBeGreaterThanOrEqual(70);
      expect(desc!.length, `description ${desc!.length} chars`).toBeLessThanOrEqual(200);

      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }
});

test("every page title is unique", async ({ page }) => {
  const seen = new Map<string, string>();
  for (const route of ALL_ROUTES) {
    await page.goto(url(route.path));
    const title = await page.title();
    const clash = seen.get(title);
    expect(clash, `${route.path} and ${clash} share the title "${title}"`).toBeUndefined();
    seen.set(title, route.path);
  }
});

test("home page carries valid JSON-LD", async ({ page }) => {
  await page.goto(url("/"));
  const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => n.textContent ?? "")
  );
  expect(blocks.length).toBeGreaterThanOrEqual(3);
  for (const b of blocks) {
    expect(() => JSON.parse(b)).not.toThrow();
    expect(JSON.parse(b)["@context"]).toBe("https://schema.org");
  }
});

test("sub-pages carry breadcrumb structured data", async ({ page }) => {
  await page.goto(url("/frameworks/nca-ecc"));
  const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => JSON.parse(n.textContent ?? "{}"))
  );
  expect(blocks.some((b) => b["@type"] === "BreadcrumbList")).toBe(true);
});
