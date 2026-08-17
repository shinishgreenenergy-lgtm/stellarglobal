import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";

export type SiteRoute = {
  path: string;
  changeFrequency: "yearly" | "monthly" | "weekly" | "daily";
  priority: number;
};

/**
 * Every indexable route, in one place. The sitemap renders from this, and the
 * e2e link and SEO suites iterate it — so a page added here without a real
 * route fails the build's tests rather than shipping a 404 in the sitemap.
 */
export const ALL_ROUTES: SiteRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/security", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  ...FRAMEWORK_FACTS.map((f) => ({
    path: `/frameworks/${f.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
];
