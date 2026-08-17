import type { MetadataRoute } from "next";
import { ALL_ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * `lastModified` is deliberately omitted: stamping build time on every URL
 * tells crawlers the whole site changed on every deploy, which is worse
 * signal than saying nothing at all.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
