import { defineConfig, devices } from "@playwright/test";

// baseURL carries the basePath from next.config.ts. Without it every request
// lands on bare "/", which the dev server 404s by design.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    // Bare origin on purpose. Putting the basePath here is a trap: goto("/")
    // would resolve against the origin and discard it, landing on the 404
    // page. Navigate via url() from e2e/helpers.ts instead.
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Pixel 5 rather than an iPhone profile: iPhone devices imply WebKit, and
    // pulling a second browser engine down doubles install size for a suite
    // that is checking responsive layout, not engine quirks. Swap to
    // devices["iPhone 13"] and run `npx playwright install webkit` if Safari
    // rendering ever needs its own coverage.
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/stellarglobal/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
