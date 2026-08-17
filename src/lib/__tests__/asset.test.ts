import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { asset, BASE_PATH } from "@/lib/asset";

describe("asset", () => {
  it("prefixes the basePath", () => {
    expect(asset("/marshal-logo.svg")).toBe(`${BASE_PATH}/marshal-logo.svg`);
  });

  it("tolerates a missing leading slash", () => {
    expect(asset("marshal-logo.svg")).toBe(`${BASE_PATH}/marshal-logo.svg`);
  });

  it("always produces an absolute path", () => {
    expect(asset("x.svg").startsWith("/")).toBe(true);
  });

  it("never emits a double slash", () => {
    expect(asset("//x.svg")).not.toMatch(/\/\//);
  });

  it("defaults to the root, which is what Netlify and dev serve", () => {
    if (!process.env.NEXT_PUBLIC_BASE_PATH) {
      expect(BASE_PATH).toBe("");
      expect(asset("/marshal-logo.svg")).toBe("/marshal-logo.svg");
    }
  });

  it("reads the same env var next.config.ts reads", () => {
    // The two must agree: if next.config.ts derived basePath from anything
    // else, assets would be emitted under one prefix and requested under
    // another — the exact failure that broke the Netlify deploy.
    const config = readFileSync(
      path.resolve(import.meta.dirname, "../../../next.config.ts"),
      "utf8"
    );
    expect(config).toContain("NEXT_PUBLIC_BASE_PATH");
  });
});
