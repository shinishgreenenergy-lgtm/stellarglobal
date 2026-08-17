import { test, expect } from "@playwright/test";
import { url, hrefFor } from "./helpers";
import { ALL_ROUTES } from "../src/lib/routes";

test("every route in the sitemap responds", async ({ request }) => {
  const broken: string[] = [];
  for (const r of ALL_ROUTES) {
    const res = await request.get(url(r.path));
    if (res.status() >= 400) broken.push(`${r.path} -> ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toHaveLength(0);
});

test("every internal link on the home page resolves", async ({ page, request }) => {
  await page.goto(url("/"));

  // Reveal the nav's hidden links. The desktop mega menu and the mobile
  // drawer hold different markup, and only one exists at a given viewport.
  const mega = page.getByRole("button", { name: /products/i }).first();
  const burger = page.getByRole("button", { name: /open menu/i });
  if (await mega.isVisible()) {
    await mega.hover();
  } else if (await burger.isVisible()) {
    await burger.click();
  }
  await page.waitForTimeout(300);

  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href")!).filter((h) => h.startsWith("/"))
  );
  const unique = [...new Set(hrefs)];
  expect(unique.length, "no internal links found — selector is wrong").toBeGreaterThan(5);

  const broken: string[] = [];
  for (const href of unique) {
    const res = await request.get(href);
    if (res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toHaveLength(0);
});

test("the footer links to every legal and trust page", async ({ page }) => {
  await page.goto(url("/"));
  // next/link renders href with the basePath already applied, so match the
  // served path rather than the site-relative one.
  for (const path of ["/security", "/privacy", "/terms", "/cookies"]) {
    await expect(
      page.locator(`footer a[href="${hrefFor(path)}"]`),
      `footer is missing a link to ${path}`
    ).toHaveCount(1);
  }
});
