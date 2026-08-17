#!/usr/bin/env node
/**
 * Dev server wrapper: waits for the server, prints the URL that actually
 * works, and opens it.
 *
 * Dev runs at the root by default, so this is usually just a convenience. It
 * earns its keep when NEXT_PUBLIC_BASE_PATH is set to reproduce the GitHub
 * Pages layout locally — then the bare root 404s while `next dev` still
 * prints "Local: http://localhost:3000", and that banner is the single most
 * confusing thing about running this project. A redirect from / would be the
 * obvious fix, but `redirects()` is unsupported with `output: "export"` and
 * errors in `next dev`
 * (node_modules/next/dist/docs/01-app/02-guides/static-exports.md).
 *
 * `npm run dev:raw` runs `next dev` with no wrapper.
 */
import { spawn } from "node:child_process";

const PORT = process.env.PORT ?? "3000";
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
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
  if (BASE_PATH) {
    console.log(`   The bare root 404s — basePath is "${BASE_PATH}".\n`);
  } else {
    console.log("");
  }

  // Only for a human at a terminal: Playwright's webServer pipes stdio, and
  // popping a browser open during a test run is nobody's idea of helpful.
  if (process.stdout.isTTY && !process.env.CI && process.env.NO_OPEN !== "1") {
    openBrowser(URL_);
  }
}
