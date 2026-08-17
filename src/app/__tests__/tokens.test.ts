import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(import.meta.dirname, "../globals.css"), "utf8");

describe("theme tokens", () => {
  it("defines a .dark block", () => {
    expect(css).toMatch(/\.dark\s*\{/);
  });

  it("no longer hardcodes the dark ground on :root", () => {
    const rootBlocks = css.match(/:root\s*\{[^}]*\}/g) ?? [];
    const anyRootIsDark = rootBlocks.some((b) => /--marshal-bg:\s*#121110/.test(b));
    expect(anyRootIsDark).toBe(false);
  });

  it("keeps the marshal token names stable", () => {
    for (const token of [
      "--color-marshal-bg",
      "--color-marshal-surface",
      "--color-marshal-text",
      "--color-marshal-divider",
      "--color-marshal-accent",
    ]) {
      expect(css).toContain(token);
    }
  });

  it("honours prefers-color-scheme for visitors who never touch the toggle", () => {
    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
  });

  it("no longer uses a hover fill that disappears on a light ground", () => {
    expect(css).not.toContain("hover:bg-white");
  });
});
