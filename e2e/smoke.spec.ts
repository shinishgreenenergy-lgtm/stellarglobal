import { test, expect } from "@playwright/test";
import { url } from "./helpers";

test("home page renders at the basePath", async ({ page }) => {
  const response = await page.goto(url("/"));
  expect(response?.status(), "home page should not 404").toBeLessThan(400);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

// Guard against the whole suite silently running against the 404 page: that
// page also has an <h1>, so a naive smoke test passes against it.
test("home page is the real page, not the 404", async ({ page }) => {
  await page.goto(url("/"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/compliance/i);
});

test("page does not scroll horizontally", async ({ page }) => {
  await page.goto(url("/"));
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});



// A logo with a wrong src still renders an <img> element, so presence alone
// proves nothing — assert the bytes actually loaded.
test("every image on the home page actually loads", async ({ page }) => {
  await page.goto(url("/"));

  // Below-fold images are loading="lazy", so they only fetch once scrolled
  // into view. Scroll each one explicitly — a scripted window.scrollTo loop
  // races the `scroll-behavior: smooth` set on <html> and reports false
  // failures for images that were simply never reached.
  const images = page.locator("img");
  for (let i = 0; i < (await images.count()); i++) {
    await images.nth(i).scrollIntoViewIfNeeded();
  }
  await page.waitForLoadState("networkidle");

  const broken = await page.$$eval("img", (imgs) =>
    imgs
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.getAttribute("src") ?? "(no src)")
  );
  expect(broken, `broken images: ${broken.join(", ")}`).toHaveLength(0);
});
