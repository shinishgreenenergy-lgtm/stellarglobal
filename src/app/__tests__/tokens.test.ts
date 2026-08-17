import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(import.meta.dirname, "../globals.css"), "utf8");

describe("theme tokens", () => {
  it("is light-only: no dark theme block", () => {
    expect(css).not.toMatch(/^\s*\.dark\s*\{/m);
  });

  it("is light-only: does not branch on the OS colour scheme", () => {
    expect(css).not.toMatch(/@media\s*\(prefers-color-scheme/);
  });

  it("declares color-scheme light so controls do not auto-darken", () => {
    expect(css).toMatch(/color-scheme:\s*light/);
  });

  it("resolves the brand ground to a light value", () => {
    expect(css).toMatch(/--marshal-bg:\s*#fbfaf7/);
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

  it("no longer uses a hover fill that disappears on a light ground", () => {
    expect(css).not.toMatch(/hover:bg-white/);
  });
});
