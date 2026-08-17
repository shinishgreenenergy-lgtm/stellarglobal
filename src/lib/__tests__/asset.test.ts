import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { asset, BASE_PATH } from "@/lib/asset";

describe("asset", () => {
  it("prefixes the basePath", () => {
    expect(asset("/marshal-logo.svg")).toBe("/stellarglobal/marshal-logo.svg");
  });

  it("tolerates a missing leading slash", () => {
    expect(asset("marshal-logo.svg")).toBe("/stellarglobal/marshal-logo.svg");
  });

  it("matches the basePath actually configured in next.config.ts", () => {
    const config = readFileSync(
      path.resolve(import.meta.dirname, "../../../next.config.ts"),
      "utf8"
    );
    const configured = config.match(/REPO_BASE_PATH\s*=\s*"([^"]+)"/)?.[1];
    expect(configured, "could not read REPO_BASE_PATH from next.config.ts").toBeDefined();
    expect(BASE_PATH).toBe(configured);
  });
});
