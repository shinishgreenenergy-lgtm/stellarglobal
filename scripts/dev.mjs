#!/usr/bin/env node
/**
 * Dev server wrapper.
 *
 * next.config.ts sets `basePath: "/stellarglobal"` so the site can be served
 * from a GitHub Pages subpath. That basePath applies in development too, so
 * nothing is mounted at the bare root — but `next dev` still prints
 * "Local: http://localhost:3000", which 404s. That banner is the single most
 * confusing thing about running this project.
 *
 * A redirect from / would be the obvious fix, but `redirects()` is
 * unsupported with `output: "export"` and errors in `next dev`
 * (node_modules/next/dist/docs/01-app/02-guides/static-exports.md). So this
 * wrapper waits for the server, prints the URL that actually works, and opens
 * it — leaving basePath identical in dev and production, which is what keeps
 * dev honest about how the deployed site behaves.
 *
 * `npm run dev:raw` runs `next dev` with no wrapper.
 */
import { spawn } from "node:child_process";

const PORT = process.env.PORT ?? "3000";
const BASE_PATH = "/stellarglobal";
const URL_ = `http://localhost:${PORT}${BASE_PATH}/`;

const child = spawn("npx", ["next", "dev"], { stdio: "inherit", shell: false });

child.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(URL_, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      // Not listening yet.
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" })
    .on("error", () => {})
    .unref();
}

if (await waitForServer()) {
  const line = "─".repeat(URL_.length + 6);
  console.log(`\n┌${line}┐`);
  console.log(`│   ${URL_}   │`);
  console.log(`└${line}┘`);
  console.log(`   The bare root 404s — basePath is "${BASE_PATH}".\n`);

  // Only for a human at a terminal: Playwright's webServer pipes stdio, and
  // popping a browser open during a test run is nobody's idea of helpful.
  if (process.stdout.isTTY && !process.env.CI && process.env.NO_OPEN !== "1") {
    openBrowser(URL_);
  }
}
