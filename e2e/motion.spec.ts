import { test, expect } from "@playwright/test";
import { url } from "./helpers";

test("sections reveal as they scroll into view", async ({ page }) => {
  await page.goto(url("/"));
  const last = page.locator(".marshal-reveal").last();
  await expect(last).toHaveAttribute("data-revealed", "false");
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute("data-revealed", "true");
});

test("content is visible immediately under reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(url("/"));
  const first = page.locator(".marshal-reveal").first();
  await expect(first).toBeVisible();
  await expect(first).toHaveCSS("opacity", "1");
  await context.close();
});

// The one that matters: a section whose observer never fires would be
// permanently invisible, and no unit test can catch that.
test("no section is left invisible after a full scroll", async ({ page }) => {
  await page.goto(url("/"));

  const sections = page.locator(".marshal-reveal");
  for (let i = 0; i < (await sections.count()); i++) {
    await sections.nth(i).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(800);

  const hidden = await page.$$eval(".marshal-reveal", (nodes) =>
    nodes
      .filter((n) => getComputedStyle(n).opacity === "0")
      .map((n) => n.textContent?.trim().slice(0, 40) ?? "(empty)")
  );
  expect(hidden, `still invisible: ${hidden.join(" | ")}`).toHaveLength(0);
});

test("the static HTML still carries the content for crawlers", async ({ request }) => {
  const res = await request.get(url("/"));
  const html = await res.text();
  // Text from a revealed section must be present without JS running.
  expect(html).toContain("Leaver revocation");
  expect(html).toContain("Evidence collected automatically from");
});

test("mobile drawer opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url("/"));

  const drawer = page.locator(".marshal-drawer");
  await expect(drawer).toBeHidden();

  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveAttribute("data-open", "true");

  await page.getByRole("button", { name: /close menu/i }).click();
  await expect(drawer).toBeHidden();
});
