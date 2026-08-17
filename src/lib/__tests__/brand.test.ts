import { describe, it, expect } from "vitest";
import { BRAND } from "@/lib/brand";

describe("BRAND", () => {
  it("names the company Stellar Global", () => {
    expect(BRAND.company).toBe("Stellar Global");
  });

  it("names the product Marshal", () => {
    expect(BRAND.product).toBe("Marshal");
  });

  it("composes the full product name", () => {
    expect(BRAND.productFull).toBe("Marshal by Stellar Global");
  });
});
