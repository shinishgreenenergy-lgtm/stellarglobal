import { describe, it, expect } from "vitest";
import { automationGroups } from "@/lib/marshal-content";

describe("test harness", () => {
  it("resolves the @/ alias and loads content", () => {
    expect(automationGroups.length).toBeGreaterThan(0);
  });
});
