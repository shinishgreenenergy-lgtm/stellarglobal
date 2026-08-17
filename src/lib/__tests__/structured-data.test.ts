import { describe, it, expect } from "vitest";
import {
  organizationLd,
  softwareApplicationLd,
  faqPageLd,
  breadcrumbLd,
} from "@/lib/structured-data";
import { faqs } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

describe("structured data", () => {
  it("describes the organisation", () => {
    const ld = organizationLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe(BRAND.company);
  });

  it("describes the product as software", () => {
    const ld = softwareApplicationLd();
    expect(ld["@type"]).toBe("SoftwareApplication");
    expect(ld.name).toBe(BRAND.product);
    expect(ld.applicationCategory).toBe("BusinessApplication");
  });

  it("emits one Question per FAQ", () => {
    const ld = faqPageLd(faqs);
    expect(ld.mainEntity).toHaveLength(faqs.length);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].a);
  });

  it("numbers breadcrumb positions from 1", () => {
    const ld = breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare/marshal-vs-vanta" },
    ]);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
  });

  it("makes every builder JSON-serialisable with a schema.org context", () => {
    for (const ld of [
      organizationLd(),
      softwareApplicationLd(),
      faqPageLd(faqs),
      breadcrumbLd([{ name: "Home", path: "/" }]),
    ]) {
      expect(() => JSON.stringify(ld)).not.toThrow();
      expect((ld as { "@context": string })["@context"]).toBe("https://schema.org");
    }
  });

  it("uses absolute urls, since crawlers cannot resolve relative ones in JSON-LD", () => {
    expect(organizationLd().url).toMatch(/^https:\/\//);
    expect(breadcrumbLd([{ name: "Home", path: "/" }]).itemListElement[0].item).toMatch(
      /^https:\/\//
    );
  });
});
