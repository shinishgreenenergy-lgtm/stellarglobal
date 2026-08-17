# Marshal GRC Site Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-page Marshal marketing site into a fact-checked, light-mode, fully-animated multi-page GRC product site under the Stellar Global brand, with complete SEO infrastructure and programmatic comparison/framework landing pages.

**Architecture:** Everything stays a Next.js 16 App Router static export (`output: "export"`). Content lives in `src/lib/` modules and is rendered by presentational components in `src/components/marshal/`; new pages are route folders under `src/app/` that consume the same content modules. Theming moves from hardcoded dark tokens on `:root` to a light-default / dark-optional token pair. Animation is one reusable `Reveal` client primitive plus pure-CSS keyframes — no animation library.

**Tech Stack:** Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4 (CSS-first `@theme`), TypeScript 5, shadcn/Base UI primitives, lucide-react. Test stack added by Task 1: Vitest 3 + React Testing Library + Playwright.

## Global Constraints

Every task's requirements implicitly include this section.

- **Static export only.** `next.config.ts` sets `output: "export"`. No route handlers, no server actions, no middleware, no ISR, no `redirects()`/`rewrites()`, no `next/image` optimization. Every dynamic route MUST export `generateStaticParams()`.
- **basePath is `/stellarglobal`.** Set in `next.config.ts:10`. Next prepends it automatically to `<Link href>` and `next/image` src. It does NOT prepend to raw `<img src>`, CSS `url()`, `fetch()`, or hand-written strings in JSON-LD / sitemap / canonical URLs — those MUST use the `absoluteUrl()` helper from Task 8.
- **Dev URL is `http://localhost:3000/stellarglobal/`.** Bare `/` returns 404 by design. Playwright `baseURL` must include the basePath.
- **Read the docs first.** Per `AGENTS.md`, this is not stock Next.js — consult `node_modules/next/dist/docs/` before using any App Router API. Heed deprecation notices.
- **Brand name is `Stellar Global`.** Product is `Marshal`. All occurrences route through `src/lib/brand.ts` (Task 2) — never hardcode either string in a component.
- **No invented compliance facts.** Any control count, clause ID, regulator name, or certification claim must either cite a primary source in a code comment or be listed in `UNVERIFIED_CLAIMS` (Task 3). A GRC vendor publishing a wrong control count is a credibility failure, not a typo.
- **No fabricated customer evidence.** Existing testimonials in `marshal-content.ts:460-473` are placeholder. They stay clearly placeholder or get removed — they must never gain named people, companies, logos, or metrics that imply real customers.
- **Third-party logos.** Vendor marks (AWS, Okta, …) are trademarks. Do not generate imitation logo files. The marquee ships with text wordmarks and accepts official SVGs only when the user supplies them (Task 20).
- **Reduced motion is mandatory.** Every animation added by Phases 6–7 must be neutralised under `@media (prefers-reduced-motion: reduce)`.
- **Commit after every task.** Conventional commit prefixes (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).

## Assumptions Made

These were ambiguous in the request; the plan proceeds on these readings. Each is cheap to reverse.

1. **"Stellar Global"** replaces the site's current "Stellar GRC" as the company name. Single-const change if wrong.
2. **"Light mode"** means light becomes the default theme, with the existing dark palette preserved and reachable via a toggle + `prefers-color-scheme`. It does not mean deleting the dark design.
3. **"All the SEO related page"** means: legal/trust pages (`/privacy`, `/terms`, `/cookies`, `/security`), SEO infrastructure (`sitemap.xml`, `robots.txt`, canonicals, JSON-LD, OG tags), and real landing pages for the 17 dead nav links (9 comparison + 8 framework).
4. **"All keywords possible"** means a governed keyword map driving per-page metadata and headings — not keyword stuffing, which would earn a spam penalty and defeat the purpose.
5. **"Fully animated"** means scroll-triggered reveals on every section plus the hero panel, using one shared primitive.

## Scope Note

This plan covers six independent subsystems (brand/content, theming, SEO, legal pages, programmatic pages, animation). Normal practice would split these into six specs. The user explicitly asked for all of it in one pass, so it is one plan — but the phases are ordered so that **work can stop cleanly after any phase** and leave a shippable site.

## File Structure

**New — libraries**
| File | Responsibility |
|---|---|
| `src/lib/brand.ts` | Single source of truth for company/product names, tagline, contact, social handles |
| `src/lib/seo.ts` | `SITE_URL`, `absoluteUrl()`, `buildMetadata()`, canonical helper |
| `src/lib/keywords.ts` | Keyword map per page slug; feeds metadata and headings |
| `src/lib/structured-data.ts` | JSON-LD builders: Organization, SoftwareApplication, FAQPage, BreadcrumbList |
| `src/lib/compare-content.ts` | Data for the 9 comparison pages |
| `src/lib/framework-content.ts` | Data for the 8 framework pages |
| `src/lib/legal-content.ts` | Body copy for privacy/terms/cookies/security |

**New — components**
| File | Responsibility |
|---|---|
| `src/components/marshal/reveal.tsx` | `Reveal` scroll-animation primitive (client) |
| `src/components/marshal/theme-toggle.tsx` | Light/dark switch (client) |
| `src/components/marshal/hero-dashboard.tsx` | The hero product panel |
| `src/components/marshal/logo-marquee.tsx` | Animated integrations marquee |
| `src/components/marshal/page-shell.tsx` | Nav + container + footer wrapper for sub-pages |
| `src/components/marshal/json-ld.tsx` | Renders a JSON-LD `<script>` |

**New — routes**
`src/app/{privacy,terms,cookies,security}/page.tsx`, `src/app/compare/[slug]/page.tsx`, `src/app/frameworks/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`

**Modified**
`src/app/globals.css` (token split), `src/app/layout.tsx` (metadata, theme script), `src/app/page.tsx` (Reveal wrappers), `src/lib/marshal-content.ts` (validation), `src/components/marshal/site-nav.tsx` (real hrefs, toggle), `src/components/marshal/integrations-strip.tsx` (marquee), `src/components/marshal/hero.tsx` (dashboard), `src/components/marshal/site-footer.tsx` (legal links), `next.config.ts` (nothing structural — comment only)

---

## Phase 0 — Test harness

### Task 1: Install and prove the test stack

The repo has zero test infrastructure. Every later task is written TDD-first and cannot start until this exists.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `src/lib/__tests__/smoke.test.ts`
- Create: `e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` (Vitest, unit/component), `npm run test:e2e` (Playwright). Later tasks call exactly these.

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest@^3 @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";

// jsdom implements neither of these; components under test use both.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(private cb: IntersectionObserverCallback) {}
  disconnect() {}
  observe(target: Element) {
    this.cb(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
);
```

- [ ] **Step 4: Create `playwright.config.ts`**

Note the `baseURL` — it must carry the basePath or every test 404s.

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000/stellarglobal",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/stellarglobal/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Add scripts to `package.json`**

Add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit",
"verify": "npm run lint && npm run typecheck && npm test && npm run build"
```

- [ ] **Step 6: Write the failing unit smoke test**

`src/lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { automationGroups } from "@/lib/marshal-content";

describe("test harness", () => {
  it("resolves the @/ alias and loads content", () => {
    expect(automationGroups.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 7: Run it**

Run: `npm test`
Expected: PASS, 1 test. If the alias fails to resolve, the `resolve.alias` block in Step 2 is wrong.

- [ ] **Step 8: Write the e2e smoke test**

`e2e/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home page renders at the basePath", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("page does not scroll horizontally", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
```

- [ ] **Step 9: Run it**

Run: `npm run test:e2e`
Expected: 4 passes (2 tests × 2 projects). The horizontal-overflow test guards the hazard recorded at `hero.tsx:4-5`, where a wider glow inset previously caused 349px of page overflow.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts playwright.config.ts src/lib/__tests__/smoke.test.ts e2e/smoke.spec.ts
git commit -m "test: add vitest + playwright harness"
```

---

## Phase 1 — Brand and content validation

### Task 2: Centralise the brand

**Files:**
- Create: `src/lib/brand.ts`
- Create: `src/lib/__tests__/brand.test.ts`
- Modify: `src/components/marshal/site-nav.tsx:38`
- Modify: `src/app/layout.tsx:12-14`
- Modify: `src/lib/marshal-content.ts:1-4` (header comment)
- Modify: `src/components/marshal/hero.tsx:16,24`

**Interfaces:**
- Consumes: nothing
- Produces: `BRAND` object with `company`, `product`, `productFull`, `tagline`, `descriptor`, `email`, `locales`. Every later task imports from here.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/brand.test.ts`:

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- brand`
Expected: FAIL — `Failed to resolve import "@/lib/brand"`.

- [ ] **Step 3: Create `src/lib/brand.ts`**

```ts
/**
 * Single source of truth for brand naming.
 *
 * The site shipped as "Stellar GRC"; the owner confirmed the company is
 * "Stellar Global". Changing `company` here renames it everywhere — no
 * component hardcodes either string.
 */
export const BRAND = {
  company: "Stellar Global",
  product: "Marshal",
  productFull: "Marshal by Stellar Global",
  tagline: "Compliance that runs itself.",
  descriptor: "the automation-first GRC platform",
  email: "hello@stellarglobal.com",
  locales: ["en", "ar"] as const,
} as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- brand`
Expected: PASS, 3 tests.

- [ ] **Step 5: Replace every hardcoded occurrence**

Find them all first:

```bash
grep -rn "Stellar GRC" src/ --include=*.tsx --include=*.ts
```

In `src/components/marshal/site-nav.tsx`, add `import { BRAND } from "@/lib/brand";` and change line 38 from `Stellar GRC` to `{BRAND.company}`.

In `src/components/marshal/hero.tsx`, add the same import; line 16 becomes:

```tsx
{BRAND.company} · NCA ECC · SAMA CSF · PDPL · ISO 27001
```

and line 24 becomes:

```tsx
{BRAND.product} is {BRAND.descriptor} from {BRAND.company}.{" "}
```

In `src/app/layout.tsx`, replace the literal `metadata` object with one built from `BRAND` (Task 8 replaces this wholesale, so keep it simple):

```tsx
export const metadata: Metadata = {
  title: `${BRAND.product} — ${BRAND.tagline} | ${BRAND.company}`,
  description: `${BRAND.product} is ${BRAND.descriptor} from ${BRAND.company}. 312 automations pull evidence from your cloud, identity, ticketing and HR systems, test every control on a schedule, and map one result to every framework you carry.`,
};
```

- [ ] **Step 6: Verify no stragglers remain**

Run: `grep -rn "Stellar GRC" src/`
Expected: no output.

- [ ] **Step 7: Run the full check**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/brand.ts src/lib/__tests__/brand.test.ts src/components/marshal/site-nav.tsx src/components/marshal/hero.tsx src/app/layout.tsx
git commit -m "feat(brand): centralise naming on Stellar Global"
```

---

### Task 3: Fact-check every compliance claim

This is the "validate the content as per the GRC platform" requirement. The current numbers came from a design handoff and are explicitly flagged as placeholder at `marshal-content.ts:1-4`.

**Files:**
- Create: `src/lib/compliance-facts.ts`
- Create: `src/lib/__tests__/compliance-facts.test.ts`
- Modify: `src/lib/marshal-content.ts:344-353` (`frameworksMenu`), `:445-458` (`frameworks`)

**Interfaces:**
- Consumes: `BRAND` (Task 2)
- Produces: `FRAMEWORK_FACTS` (verified, each with a `source` string) and `UNVERIFIED_CLAIMS` (string[]). Tasks 15 and 16 read `FRAMEWORK_FACTS`.

- [ ] **Step 1: Research each framework against a primary source**

For each of the twelve frameworks in `marshal-content.ts:445-458`, confirm the control count and the exact official name. Record the source URL. Known checkpoints to confirm or correct:

| Framework | Site currently claims | Check |
|---|---|---|
| ISO/IEC 27001:2022 | 93 controls | Annex A of the 2022 revision — expected correct |
| PCI DSS v4.0 | 12 requirements | Expected correct |
| NIST CSF 2.0 | 6 functions | Govern, Identify, Protect, Detect, Respond, Recover — expected correct |
| SOC 2 | 5 criteria | Five Trust Services Criteria — expected correct |
| NCA ECC | 108 controls | ECC-1:2018 vs ECC-2:2024 differ; confirm which edition and its count |
| NCA CSCC | 85 controls | CSCC-1:2019 main vs sub-control counts differ; confirm |
| SAMA CSF | 250 controls | Confirm against the published framework |
| SAMA BCM | 75 controls | Confirm |
| PDPL | "72-hour breach notice to SDAIA" | Confirm the window and that SDAIA is still the regulator |

Also confirm the organisation names: NCA = National Cybersecurity Authority (Saudi Arabia); SAMA = Saudi Central Bank (still styled SAMA); SDAIA = Saudi Data & AI Authority.

- [ ] **Step 2: Write the failing test**

`src/lib/__tests__/compliance-facts.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { FRAMEWORK_FACTS, UNVERIFIED_CLAIMS } from "@/lib/compliance-facts";
import { frameworks } from "@/lib/marshal-content";

describe("compliance facts", () => {
  it("cites a source for every verified fact", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(f.source, `${f.slug} has no source`).toMatch(/^https?:\/\//);
    }
  });

  it("gives every framework a unique slug", () => {
    const slugs = FRAMEWORK_FACTS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses kebab-case slugs safe for URLs", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(f.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("does not claim a control count that is also listed as unverified", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(UNVERIFIED_CLAIMS).not.toContain(f.slug);
    }
  });

  it("keeps the marketing framework list in step with the facts", () => {
    expect(frameworks.length).toBe(FRAMEWORK_FACTS.length);
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm test -- compliance-facts`
Expected: FAIL — cannot resolve `@/lib/compliance-facts`.

- [ ] **Step 4: Create `src/lib/compliance-facts.ts`**

Fill `controlCount` and `source` from Step 1's research. Anything Step 1 could not confirm goes in `UNVERIFIED_CLAIMS` and gets `controlCount: null` — the UI renders "—" rather than a number.

```ts
/**
 * Verified framework facts. Every entry carries the primary source it was
 * checked against.
 *
 * Rule: no number ships without a source. A GRC vendor publishing a wrong
 * control count is a credibility failure, not a typo. If a figure cannot be
 * confirmed, put the slug in UNVERIFIED_CLAIMS and set controlCount to null.
 */
export type FrameworkFact = {
  slug: string;
  name: string;
  officialName: string;
  authority: string;
  region: string;
  controlCount: number | null;
  controlUnit: string;
  summary: string;
  source: string;
};

export const FRAMEWORK_FACTS: FrameworkFact[] = [
  {
    slug: "iso-27001",
    name: "ISO/IEC 27001",
    officialName: "ISO/IEC 27001:2022 — Information security management systems",
    authority: "International Organization for Standardization",
    region: "International",
    controlCount: 93,
    controlUnit: "Annex A controls",
    summary:
      "The management-system standard for information security. Annex A of the 2022 revision restructures the control set into four themes.",
    source: "https://www.iso.org/standard/27001",
  },
  // ...one entry per framework, each with its confirmed count and source.
];

/** Slugs whose published figures could not be confirmed against a primary source. */
export const UNVERIFIED_CLAIMS: string[] = [];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- compliance-facts`
Expected: PASS, 5 tests. The last test forces `marshal-content.ts`'s `frameworks` array to stay the same length — reconcile it now if Step 1 removed or added a framework.

- [ ] **Step 6: Correct `marshal-content.ts` from the research**

Update `frameworksMenu` (`:344-353`) and `frameworks` (`:445-458`) so every count matches `FRAMEWORK_FACTS`. Replace the file header comment at `:1-4` with:

```ts
// Content for the Marshal (Stellar Global) marketing site.
//
// Framework names and control counts are verified against primary sources in
// src/lib/compliance-facts.ts. Marketing claims that are NOT verifiable from a
// public standard — automation counts, percentages, time-to-certification,
// customer quotes — remain placeholder and must be confirmed by legal and
// marketing before launch. See UNVERIFIED_CLAIMS.
```

- [ ] **Step 7: Write down what is still unverifiable**

The following are business claims, not standards facts, and no amount of research settles them. Add them to the header comment as an explicit list so nobody mistakes them for checked: `312 automations`, `91% of evidence collected without a human`, `40+ frameworks`, `6 wks median time to first certification` (`marshal-content.ts:388-393`), all per-group automation counts, and all three testimonials (`:460-473`).

- [ ] **Step 8: Run the full check**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add src/lib/compliance-facts.ts src/lib/__tests__/compliance-facts.test.ts src/lib/marshal-content.ts
git commit -m "feat(content): verify framework facts against primary sources"
```

---

### Task 4: Build the hero dashboard panel

Replaces the empty placeholder at `hero.tsx:39-46`. Design approved earlier in the session: one automation run fanning out to the framework clauses it cleared.

**Files:**
- Modify: `src/lib/marshal-content.ts` (append `heroRun`)
- Create: `src/components/marshal/hero-dashboard.tsx`
- Create: `src/components/marshal/__tests__/hero-dashboard.test.tsx`
- Modify: `src/components/marshal/hero.tsx:39-46`
- Modify: `src/app/globals.css` (append keyframes)

**Interfaces:**
- Consumes: `BRAND` (Task 2)
- Produces: `<HeroDashboard />` (no props); `heroRun` export; CSS keyframe `marshal-clause-in` and class `.animate-clause-in`, both reused by Task 17.

- [ ] **Step 1: Write the failing test**

`src/components/marshal/__tests__/hero-dashboard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroDashboard } from "@/components/marshal/hero-dashboard";
import { heroRun } from "@/lib/marshal-content";

describe("HeroDashboard", () => {
  it("names the automation that ran", () => {
    render(<HeroDashboard />);
    expect(screen.getByText(heroRun.automation)).toBeInTheDocument();
  });

  it("lists every framework the run cleared", () => {
    render(<HeroDashboard />);
    for (const clause of heroRun.cleared) {
      expect(screen.getByText(clause.framework)).toBeInTheDocument();
      expect(screen.getByText(clause.reference)).toBeInTheDocument();
    }
  });

  it("describes itself for screen readers", () => {
    render(<HeroDashboard />);
    expect(screen.getByRole("figure")).toHaveAccessibleName(/cleared/i);
  });

  it("staggers each clause row by its index", () => {
    const { container } = render(<HeroDashboard />);
    const rows = container.querySelectorAll("[data-clause-row]");
    expect(rows).toHaveLength(heroRun.cleared.length);
    expect((rows[1] as HTMLElement).style.animationDelay).toBe("90ms");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- hero-dashboard`
Expected: FAIL — cannot resolve `@/components/marshal/hero-dashboard`.

- [ ] **Step 3: Append `heroRun` to `src/lib/marshal-content.ts`**

The clause IDs extend the set already published for this automation at `marshal-content.ts:96-99` (`ECC 2-2-3 · ISO A.5.11`) — they must not contradict it.

```ts
/**
 * The single automation run shown in the hero panel. Illustrative, not a real
 * tenant: the counts and timestamp are placeholder per the header note. The
 * clause IDs extend the set already published for "Leaver revocation" above.
 */
export const heroRun = {
  automation: "Leaver revocation",
  cadence: "On HRIS event",
  status: "Passed",
  ranAt: "04:12",
  counters: [
    { value: "14", label: "terminations processed" },
    { value: "14", label: "revoked inside 24h" },
  ],
  cleared: [
    { framework: "NCA ECC", reference: "2-2-3" },
    { framework: "ISO/IEC 27001", reference: "A.5.11" },
    { framework: "SOC 2", reference: "CC6.2" },
    { framework: "SAMA CSF", reference: "3.3.5" },
    { framework: "PDPL", reference: "Art. 20" },
  ],
} as const;
```

- [ ] **Step 4: Add the keyframes to `src/app/globals.css`**

Append after the `@layer components` block:

```css
@layer utilities {
  @keyframes marshal-clause-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .animate-clause-in {
    animation: marshal-clause-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-clause-in {
      animation: none;
    }
  }
}
```

- [ ] **Step 5: Create `src/components/marshal/hero-dashboard.tsx`**

```tsx
import { Check } from "lucide-react";
import { heroRun } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

export function HeroDashboard() {
  return (
    <figure
      aria-label={`${BRAND.product} run detail: one ${heroRun.automation} test cleared ${heroRun.cleared.length} frameworks`}
      className="border-marshal-neutral-800 bg-marshal-surface m-0 overflow-hidden rounded-2xl border"
    >
      <div className="border-marshal-divider flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <span className="text-marshal-text/60 text-xs">
          {BRAND.product} <span aria-hidden>›</span> Automations{" "}
          <span aria-hidden>›</span>{" "}
          <span className="text-marshal-text/85">{heroRun.automation}</span>
        </span>
        <span className="text-marshal-text/40 hidden text-[11px] tracking-[0.06em] uppercase sm:inline">
          Read-only · {heroRun.cadence}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[38fr_62fr] md:[aspect-ratio:1200/540]">
        <div className="border-marshal-divider flex flex-col gap-4 border-b p-5 md:border-r md:border-b-0">
          <span className="border-marshal-accent-800 text-marshal-accent-300 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase">
            <span className="bg-marshal-accent size-1.5 rounded-full" aria-hidden />
            {heroRun.status} · {heroRun.ranAt}
          </span>

          <div>
            <p className="font-heading text-marshal-text m-0 text-lg font-semibold">
              {heroRun.automation}
            </p>
            <p className="text-marshal-text/55 m-0 mt-1 text-sm">{heroRun.cadence}</p>
          </div>

          <dl className="mt-auto grid grid-cols-2 gap-4">
            {heroRun.counters.map((c) => (
              <div key={c.label}>
                <dt className="text-marshal-text/50 order-2 text-xs leading-snug">{c.label}</dt>
                <dd className="font-heading text-marshal-text m-0 text-2xl font-bold">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col p-5">
          <p className="text-marshal-text/50 m-0 mb-3 text-[11px] tracking-[0.08em] uppercase">
            Cleared this run
          </p>

          <ul className="m-0 flex list-none flex-col gap-px p-0">
            {heroRun.cleared.map((clause, i) => (
              <li
                key={clause.framework}
                data-clause-row
                style={{ animationDelay: `${i * 90}ms` }}
                className="animate-clause-in hover:bg-marshal-neutral-900 flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors"
              >
                <span className="text-marshal-text text-sm">{clause.framework}</span>
                <span className="flex items-center gap-2.5">
                  <span className="text-marshal-text/50 font-mono text-xs">{clause.reference}</span>
                  <Check className="text-marshal-accent size-3.5" aria-hidden />
                </span>
              </li>
            ))}
          </ul>

          <p className="border-marshal-divider text-marshal-text/45 mt-auto border-t pt-3 text-xs">
            One test · {heroRun.cleared.length} frameworks · evidence filed automatically
          </p>
        </div>
      </div>
    </figure>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- hero-dashboard`
Expected: PASS, 4 tests.

- [ ] **Step 7: Swap it into the hero**

In `src/components/marshal/hero.tsx`, add `import { HeroDashboard } from "@/components/marshal/hero-dashboard";` and replace the whole `<figure>` block at lines 39-46 with:

```tsx
      <div className="mt-[44px]">
        <HeroDashboard />
      </div>
```

- [ ] **Step 8: Verify no horizontal overflow**

Run: `npm run test:e2e -- smoke`
Expected: PASS on both desktop and mobile. The overflow assertion is the one that matters — `hero.tsx:4-5` records a prior 349px overflow from a wide child in this exact box.

- [ ] **Step 9: Run the full check and commit**

```bash
npm run verify
git add src/lib/marshal-content.ts src/components/marshal/hero-dashboard.tsx src/components/marshal/__tests__/hero-dashboard.test.tsx src/components/marshal/hero.tsx src/app/globals.css
git commit -m "feat(hero): add the run-detail dashboard panel"
```

---

## Phase 2 — Light mode

### Task 5: Split the tokens into light and dark

Today `globals.css:131-151` writes dark values onto `:root`, overriding the shadcn light defaults above it. Light mode requires inverting that: light on `:root`, dark under `.dark`.

**Files:**
- Modify: `src/app/globals.css:7-11, 54-88, 125-151`
- Create: `src/app/__tests__/tokens.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: light-default tokens on `:root`, dark overrides under `.dark`. The `--color-marshal-*` names are unchanged, so no component needs editing.

- [ ] **Step 1: Write the failing test**

`src/app/__tests__/tokens.test.ts` — a text assertion on the stylesheet, since jsdom will not resolve Tailwind's `@theme`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(__dirname, "../globals.css"), "utf8");

describe("theme tokens", () => {
  it("defines a .dark block", () => {
    expect(css).toMatch(/\.dark\s*\{/);
  });

  it("no longer hardcodes the dark ground on :root", () => {
    const rootBlocks = css.match(/:root\s*\{[^}]*\}/g) ?? [];
    const anyRootIsDark = rootBlocks.some((b) => /--background:\s*#121110/.test(b));
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
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tokens`
Expected: FAIL on the `.dark` block and the `prefers-color-scheme` assertions.

- [ ] **Step 3: Replace the comment at `globals.css:7-11`**

```css
/*
 * Marshal (Stellar Global) design tokens.
 *
 * Light is the default: the brand ramp resolves to a warm paper ground on
 * :root. Dark is the original warm-charcoal treatment, reachable two ways —
 * a .dark class set by the theme toggle, and prefers-color-scheme for
 * visitors who never touch it. The `light` class pins light mode so the
 * toggle can override a dark OS preference.
 */
```

- [ ] **Step 4: Rewrite the brand ramp in `@theme inline`**

Replace lines 54-88. The ramp indirects through `--marshal-*` variables so the theme blocks can reassign them:

```css
  /* Marshal brand ramp -> Tailwind utilities (bg-marshal-*, text-marshal-*, border-marshal-*).
     Each maps to a plain custom property that the theme blocks below reassign. */
  --color-marshal-bg: var(--marshal-bg);
  --color-marshal-surface: var(--marshal-surface);
  --color-marshal-text: var(--marshal-text);
  --color-marshal-divider: var(--marshal-divider);
  --color-marshal-section: var(--marshal-section);
  --color-marshal-section-glow: var(--marshal-section-glow);
  --color-marshal-section-ghost: var(--marshal-section-ghost);

  --color-marshal-neutral-100: var(--marshal-neutral-100);
  --color-marshal-neutral-200: var(--marshal-neutral-200);
  --color-marshal-neutral-300: var(--marshal-neutral-300);
  --color-marshal-neutral-400: var(--marshal-neutral-400);
  --color-marshal-neutral-500: var(--marshal-neutral-500);
  --color-marshal-neutral-600: var(--marshal-neutral-600);
  --color-marshal-neutral-700: var(--marshal-neutral-700);
  --color-marshal-neutral-800: var(--marshal-neutral-800);
  --color-marshal-neutral-900: var(--marshal-neutral-900);

  --color-marshal-accent: var(--marshal-accent);
  --color-marshal-accent-2: var(--marshal-accent-2);
  --color-marshal-accent-100: var(--marshal-accent-100);
  --color-marshal-accent-200: var(--marshal-accent-200);
  --color-marshal-accent-300: var(--marshal-accent-300);
  --color-marshal-accent-400: var(--marshal-accent-400);
  --color-marshal-accent-500: var(--marshal-accent-500);
  --color-marshal-accent-600: var(--marshal-accent-600);
  --color-marshal-accent-700: var(--marshal-accent-700);
  --color-marshal-accent-800: var(--marshal-accent-800);
  --color-marshal-accent-900: var(--marshal-accent-900);

  --shadow-marshal-sm: 0 0 0 1px var(--marshal-neutral-200);
  --shadow-marshal-md: 0 0 0 1px var(--marshal-neutral-300), 0 6px 18px var(--marshal-shadow-md);
  --shadow-marshal-lg: 0 0 0 1px var(--marshal-neutral-300), 0 16px 40px var(--marshal-shadow-lg);
```

- [ ] **Step 5: Replace the two `:root` blocks (lines 90-151) with light defaults**

The accent darkens in light mode — `#d3a03a` on white is roughly 2.1:1 and fails WCAG AA for text. `--marshal-accent-700` (`#86621f`) clears 4.5:1 on the paper ground and becomes the light-mode text accent.

```css
:root {
  color-scheme: light;

  /* Marshal ramp — light */
  --marshal-bg: #fbfaf7;
  --marshal-surface: #ffffff;
  --marshal-text: #1a1815;
  --marshal-divider: color-mix(in srgb, #1a1815 12%, transparent);
  --marshal-section: #f4f1ea;
  --marshal-section-glow: #efe8d8;
  --marshal-section-ghost: #e2d5b4;

  --marshal-neutral-100: #221f1b;
  --marshal-neutral-200: #35302a;
  --marshal-neutral-300: #4e483f;
  --marshal-neutral-400: #6b6459;
  --marshal-neutral-500: #8d8578;
  --marshal-neutral-600: #b0a99c;
  --marshal-neutral-700: #d2ccc1;
  --marshal-neutral-800: #e8e4dc;
  --marshal-neutral-900: #f7f5f1;

  --marshal-accent: #a87a22;
  --marshal-accent-2: #86621f;
  --marshal-accent-100: #3d2d10;
  --marshal-accent-200: #5e4517;
  --marshal-accent-300: #86621f;
  --marshal-accent-400: #ad802a;
  --marshal-accent-500: #d3a03a;
  --marshal-accent-600: #e2ba60;
  --marshal-accent-700: #eed392;
  --marshal-accent-800: #f8e7bf;
  --marshal-accent-900: #fdf6e6;

  --marshal-shadow-md: rgba(26, 24, 21, 0.08);
  --marshal-shadow-lg: rgba(26, 24, 21, 0.12);

  /* shadcn semantic tokens -> the light ramp */
  --background: var(--marshal-bg);
  --foreground: var(--marshal-text);
  --card: var(--marshal-surface);
  --card-foreground: var(--marshal-text);
  --popover: var(--marshal-surface);
  --popover-foreground: var(--marshal-text);
  --primary: #1a1815;
  --primary-foreground: #fbfaf7;
  --secondary: var(--marshal-section);
  --secondary-foreground: var(--marshal-text);
  --muted: var(--marshal-section);
  --muted-foreground: color-mix(in srgb, #1a1815 62%, transparent);
  --accent: var(--marshal-section);
  --accent-foreground: var(--marshal-text);
  --destructive: oklch(0.577 0.245 27.325);
  --border: var(--marshal-divider);
  --input: var(--marshal-divider);
  --ring: var(--marshal-accent);
  --radius: 0.875rem;

  --sidebar: var(--marshal-surface);
  --sidebar-foreground: var(--marshal-text);
  --sidebar-primary: #1a1815;
  --sidebar-primary-foreground: #fbfaf7;
  --sidebar-accent: var(--marshal-section);
  --sidebar-accent-foreground: var(--marshal-text);
  --sidebar-border: var(--marshal-divider);
  --sidebar-ring: var(--marshal-accent);

  --chart-1: var(--marshal-accent-500);
  --chart-2: var(--marshal-accent-300);
  --chart-3: var(--marshal-neutral-400);
  --chart-4: var(--marshal-neutral-500);
  --chart-5: var(--marshal-neutral-600);
}
```

- [ ] **Step 6: Add the dark block**

```css
/* Dark — the original warm-charcoal brand treatment. */
.dark {
  color-scheme: dark;

  --marshal-bg: #121110;
  --marshal-surface: #1c1a18;
  --marshal-text: #f2efe9;
  --marshal-divider: color-mix(in srgb, #f2efe9 14%, transparent);
  --marshal-section: #1e1a14;
  --marshal-section-glow: #2e261a;
  --marshal-section-ghost: #5e4517;

  --marshal-neutral-100: #f7f5f1;
  --marshal-neutral-200: #e8e4dc;
  --marshal-neutral-300: #d2ccc1;
  --marshal-neutral-400: #b0a99c;
  --marshal-neutral-500: #8d8578;
  --marshal-neutral-600: #6b6459;
  --marshal-neutral-700: #4e483f;
  --marshal-neutral-800: #35302a;
  --marshal-neutral-900: #221f1b;

  --marshal-accent: #d3a03a;
  --marshal-accent-2: #e0b866;
  --marshal-accent-100: #fdf6e6;
  --marshal-accent-200: #f8e7bf;
  --marshal-accent-300: #eed392;
  --marshal-accent-400: #e2ba60;
  --marshal-accent-500: #d3a03a;
  --marshal-accent-600: #ad802a;
  --marshal-accent-700: #86621f;
  --marshal-accent-800: #5e4517;
  --marshal-accent-900: #3d2d10;

  --marshal-shadow-md: rgba(0, 0, 0, 0.6);
  --marshal-shadow-lg: rgba(0, 0, 0, 0.7);

  --primary: #f7f5f1;
  --primary-foreground: #121110;
  --muted-foreground: color-mix(in srgb, #f2efe9 60%, transparent);
  --destructive: oklch(0.704 0.191 22.216);
}

/* Visitors who never touch the toggle follow their OS. The .light class,
   written by the toggle, opts back out of this. */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    color-scheme: dark;

    --marshal-bg: #121110;
    --marshal-surface: #1c1a18;
    --marshal-text: #f2efe9;
    --marshal-divider: color-mix(in srgb, #f2efe9 14%, transparent);
    --marshal-section: #1e1a14;
    --marshal-section-glow: #2e261a;
    --marshal-section-ghost: #5e4517;

    --marshal-neutral-100: #f7f5f1;
    --marshal-neutral-200: #e8e4dc;
    --marshal-neutral-300: #d2ccc1;
    --marshal-neutral-400: #b0a99c;
    --marshal-neutral-500: #8d8578;
    --marshal-neutral-600: #6b6459;
    --marshal-neutral-700: #4e483f;
    --marshal-neutral-800: #35302a;
    --marshal-neutral-900: #221f1b;

    --marshal-accent: #d3a03a;
    --marshal-accent-2: #e0b866;
    --marshal-accent-100: #fdf6e6;
    --marshal-accent-200: #f8e7bf;
    --marshal-accent-300: #eed392;
    --marshal-accent-400: #e2ba60;
    --marshal-accent-500: #d3a03a;
    --marshal-accent-600: #ad802a;
    --marshal-accent-700: #86621f;
    --marshal-accent-800: #5e4517;
    --marshal-accent-900: #3d2d10;

    --marshal-shadow-md: rgba(0, 0, 0, 0.6);
    --marshal-shadow-lg: rgba(0, 0, 0, 0.7);

    --primary: #f7f5f1;
    --primary-foreground: #121110;
    --muted-foreground: color-mix(in srgb, #f2efe9 60%, transparent);
    --destructive: oklch(0.704 0.191 22.216);
  }
}
```

- [ ] **Step 7: Fix the two buttons that assume a dark ground**

`.btn-marshal-primary` (`globals.css:172-174`) fills with `bg-marshal-neutral-100` and sets `text-marshal-bg`. Both flip correctly with the inverted neutral ramp, but `hover:bg-white` does not — on light it produces a white-on-white button. Replace the two component rules:

```css
  .btn-marshal-primary {
    @apply inline-flex items-center justify-center rounded-full bg-marshal-neutral-100 px-5 py-3 text-xs font-semibold tracking-[0.06em] text-marshal-bg uppercase transition-opacity hover:opacity-88;
  }
  .btn-marshal-ghost {
    @apply inline-flex items-center justify-center rounded-full border px-5 py-3 text-xs font-semibold tracking-[0.06em] text-marshal-text uppercase transition-colors hover:border-marshal-accent hover:text-marshal-accent;
    border-color: color-mix(in srgb, var(--color-marshal-text) 45%, transparent);
  }
```

- [ ] **Step 8: Run the tests**

Run: `npm test -- tokens`
Expected: PASS, 4 tests.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css src/app/__tests__/tokens.test.ts
git commit -m "feat(theme): make light the default and move dark behind .dark"
```

---

### Task 6: Add the theme toggle

**Files:**
- Create: `src/components/marshal/theme-toggle.tsx`
- Create: `src/components/marshal/__tests__/theme-toggle.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/marshal/site-nav.tsx:140-153`

**Interfaces:**
- Consumes: nothing
- Produces: `<ThemeToggle />` (no props). Writes `localStorage["marshal-theme"]` = `"light" | "dark"` and toggles `.light`/`.dark` on `<html>`.

- [ ] **Step 1: Write the failing test**

`src/components/marshal/__tests__/theme-toggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/marshal/theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("exposes an accessible name", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/theme/i);
  });

  it("switches the document to dark on first press", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
  });

  it("persists the choice", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("marshal-theme")).toBe("dark");
  });

  it("switches back to light on the second press", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(document.documentElement).toHaveClass("light");
    expect(localStorage.getItem("marshal-theme")).toBe("light");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- theme-toggle`
Expected: FAIL — cannot resolve the module.

- [ ] **Step 3: Create `src/components/marshal/theme-toggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read whatever the inline boot script already settled on, so the button
  // icon matches the paint instead of flipping after hydration.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    try {
      localStorage.setItem("marshal-theme", next);
    } catch {
      // Private mode or blocked storage — the toggle still works for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="text-marshal-text/70 hover:text-marshal-accent hover:border-marshal-accent border-marshal-neutral-800 inline-flex size-9 items-center justify-center rounded-full border transition-colors"
    >
      {mounted && theme === "dark" ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- theme-toggle`
Expected: PASS, 4 tests.

- [ ] **Step 5: Add the no-flash boot script to `src/app/layout.tsx`**

This must run before first paint, so it goes in `<head>` as a blocking inline script. Without it a stored dark preference paints light for one frame.

```tsx
const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem("marshal-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.add(dark ? "dark" : "light");
  } catch (e) {
    document.documentElement.classList.add("light");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-marshal-bg text-marshal-text min-h-full">{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is required — the boot script mutates `className` before React hydrates, which React would otherwise report as a mismatch.

- [ ] **Step 6: Mount the toggle in the nav**

In `src/components/marshal/site-nav.tsx`, import it and insert into the right-hand cluster at line 140, before the "Book a demo" button:

```tsx
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button type="button" className="btn-marshal-primary hidden sm:inline-flex">
          Book a demo
        </button>
```

- [ ] **Step 7: Write the e2e test for the no-flash path**

Append to `e2e/smoke.spec.ts`:

```ts
test("respects a stored dark preference on first paint", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("marshal-theme", "dark"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("toggle switches the theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
```

- [ ] **Step 8: Run everything**

Run: `npm run verify && npm run test:e2e`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add src/components/marshal/theme-toggle.tsx src/components/marshal/__tests__/theme-toggle.test.tsx src/app/layout.tsx src/components/marshal/site-nav.tsx e2e/smoke.spec.ts
git commit -m "feat(theme): add light/dark toggle with no-flash boot script"
```

---

### Task 7: Audit every section for light-mode contrast

The token swap fixes most of it, but several components use hardcoded rgba, opacity-suffixed text (`text-marshal-text/48`), and gradients tuned for a dark ground.

**Files:**
- Modify: `src/components/marshal/hero.tsx:6-13` (ambient glow)
- Modify: `src/components/marshal/site-nav.tsx:34-36` (backdrop `color-mix`)
- Modify: any of `stat-band.tsx`, `anatomy-pipeline.tsx`, `platform-disciplines.tsx`, `framework-library.tsx`, `testimonials.tsx`, `closing-cta.tsx`, `site-footer.tsx` that fail the audit
- Create: `e2e/contrast.spec.ts`

**Interfaces:**
- Consumes: tokens from Task 5, toggle from Task 6
- Produces: no new API

- [ ] **Step 1: Find every hardcoded colour**

```bash
grep -rn "rgba(\|#[0-9a-fA-F]\{3,8\}\|text-white\|bg-white\|text-black\|bg-black" src/components/ src/app/page.tsx
```

Every hit is a candidate: a literal colour cannot respond to the theme. Replace each with a `marshal-*` token or a `color-mix` on one.

- [ ] **Step 2: Find every low-opacity text utility**

```bash
grep -rn "text-marshal-text/[0-9]" src/components/
```

`/48`, `/45`, `/40` and below were chosen against `#121110`. On the `#fbfaf7` light ground the same ratio yields far less contrast. Raise anything below `/55` to at least `/60` for body-sized text; sub-`/50` is acceptable only for decorative text at 11px+ that duplicates information available elsewhere.

- [ ] **Step 3: Make the hero glow theme-aware**

`hero.tsx:9-13` uses the accent at 15% over a dark ground. At light-mode accent values this reads as a dirty smudge. Gate the strength:

```tsx
        style={{
          background:
            "radial-gradient(90% 75% at 78% 26%, color-mix(in srgb, var(--color-marshal-accent) var(--marshal-glow-strength, 15%), transparent) 0%, transparent 74%)",
        }}
```

and add to the `:root` block in `globals.css`: `--marshal-glow-strength: 8%;` and to `.dark` and the `prefers-color-scheme: dark` block: `--marshal-glow-strength: 15%;`

- [ ] **Step 4: Fix the sticky nav backdrop**

`site-nav.tsx:35` mixes `--color-marshal-bg` at 92% — correct in both themes once the token flips, so this needs no change. Verify by eye that the blur still reads over light content; if it does not, raise to 94%.

- [ ] **Step 5: Write the automated contrast check**

`e2e/contrast.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

function relativeLuminance([r, g, b]: number[]) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function parse(color: string): number[] {
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m) throw new Error(`unparseable colour: ${color}`);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

for (const theme of ["light", "dark"] as const) {
  test(`body text meets WCAG AA in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("marshal-theme", t), theme);
    await page.goto("/");

    const samples = await page.$$eval("h1, h2, h3, p, li, a, dt, dd", (nodes) =>
      nodes.slice(0, 120).map((n) => {
        const s = getComputedStyle(n);
        let bgEl: Element | null = n;
        let bg = "rgba(0, 0, 0, 0)";
        while (bgEl) {
          const c = getComputedStyle(bgEl).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            bg = c;
            break;
          }
          bgEl = bgEl.parentElement;
        }
        return {
          fg: s.color,
          bg,
          size: parseFloat(s.fontSize),
          weight: Number(s.fontWeight) || 400,
          text: (n.textContent ?? "").trim().slice(0, 40),
        };
      })
    );

    const failures: string[] = [];
    for (const s of samples) {
      if (!s.text) continue;
      const l1 = relativeLuminance(parse(s.fg));
      const l2 = relativeLuminance(parse(s.bg));
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const isLarge = s.size >= 24 || (s.size >= 18.66 && s.weight >= 700);
      const required = isLarge ? 3 : 4.5;
      if (ratio < required) {
        failures.push(`"${s.text}" ${ratio.toFixed(2)}:1 (needs ${required}:1)`);
      }
    }

    expect(failures, failures.join("\n")).toHaveLength(0);
  });
}
```

- [ ] **Step 6: Run it and fix what it names**

Run: `npm run test:e2e -- contrast`
Expected: initially FAIL with a list. Fix each named element by raising its token or opacity, then re-run until green. Do not silence the test by narrowing the selector.

- [ ] **Step 7: Capture both themes for review**

```bash
npx playwright screenshot --viewport-size=1440,900 "http://localhost:3000/stellarglobal/" /tmp/light.png
```

Look at the screenshot. Confirm the hero, stat band, and footer all read as deliberate light design rather than dark design with the colours flipped.

- [ ] **Step 8: Commit**

```bash
git add src/components/marshal src/app/globals.css e2e/contrast.spec.ts
git commit -m "fix(theme): pass WCAG AA in both themes"
```

---

## Phase 3 — SEO foundation

### Task 8: SEO helpers and keyword map

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/keywords.ts`
- Create: `src/lib/__tests__/seo.test.ts`

**Interfaces:**
- Consumes: `BRAND` (Task 2)
- Produces: `SITE_URL`, `absoluteUrl(path)`, `buildMetadata(opts)`, `KEYWORDS` map. Tasks 9–16 all consume these.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/seo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { SITE_URL, absoluteUrl, buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

describe("absoluteUrl", () => {
  it("includes the basePath", () => {
    expect(absoluteUrl("/privacy")).toBe(`${SITE_URL}/stellarglobal/privacy`);
  });

  it("normalises a missing leading slash", () => {
    expect(absoluteUrl("privacy")).toBe(`${SITE_URL}/stellarglobal/privacy`);
  });

  it("maps the site root to the basePath root", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/stellarglobal`);
  });
});

describe("buildMetadata", () => {
  it("sets a canonical", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/privacy" });
    expect(m.alternates?.canonical).toBe(absoluteUrl("/privacy"));
  });

  it("sets OpenGraph and Twitter cards", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/privacy" });
    expect(m.openGraph?.url).toBe(absoluteUrl("/privacy"));
    expect(m.twitter).toBeDefined();
  });

  it("can mark a page noindex", () => {
    const m = buildMetadata({ title: "T", description: "D", path: "/x", noindex: true });
    expect(m.robots).toMatchObject({ index: false });
  });
});

describe("KEYWORDS", () => {
  it("has no duplicate terms within a page", () => {
    for (const [slug, terms] of Object.entries(KEYWORDS)) {
      expect(new Set(terms).size, `${slug} repeats a term`).toBe(terms.length);
    }
  });

  it("caps each page at 12 terms", () => {
    for (const [slug, terms] of Object.entries(KEYWORDS)) {
      expect(terms.length, `${slug} has too many`).toBeLessThanOrEqual(12);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- seo`
Expected: FAIL — cannot resolve `@/lib/seo`.

- [ ] **Step 3: Create `src/lib/seo.ts`**

```ts
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

/**
 * Production origin. GitHub Pages serves this repo at a subpath; if a custom
 * domain is added later, change SITE_URL and drop BASE_PATH to "".
 * BASE_PATH must stay in step with next.config.ts.
 */
export const SITE_URL = "https://stellarglobal.github.io";
export const BASE_PATH = "/stellarglobal";

/**
 * Next prepends basePath to <Link> and next/image automatically, but NOT to
 * strings we hand-write into canonical tags, JSON-LD or the sitemap. Those
 * must come through here.
 */
export function absoluteUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${SITE_URL}${BASE_PATH}/${clean}` : `${SITE_URL}${BASE_PATH}`;
}

export type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noindex,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(BRAND.product)
    ? `${title} | ${BRAND.company}`
    : `${title} | ${BRAND.productFull}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: BRAND.productFull,
      title: fullTitle,
      description,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

- [ ] **Step 4: Create `src/lib/keywords.ts`**

Twelve terms per page is the cap the test enforces. Keyword stuffing triggers spam classifiers and would defeat the goal — breadth comes from having many well-targeted pages (Tasks 14–16), not from crowding one.

```ts
/**
 * Target search terms per page slug. Feeds metadata keywords and informs
 * headings — it does not license stuffing. Twelve per page, each one a term a
 * real buyer would type.
 */
export const KEYWORDS: Record<string, string[]> = {
  home: [
    "GRC platform",
    "compliance automation",
    "automated evidence collection",
    "continuous compliance",
    "NCA ECC compliance software",
    "SAMA CSF compliance",
    "ISO 27001 automation",
    "PDPL compliance Saudi Arabia",
    "SOC 2 automation",
    "risk management software",
    "audit management platform",
    "compliance software Saudi Arabia",
  ],
  privacy: ["privacy policy", "data protection", "PDPL privacy notice", "GDPR privacy policy"],
  terms: ["terms of service", "software licence terms", "SaaS agreement"],
  cookies: ["cookie policy", "cookie consent", "tracking technologies"],
  security: [
    "security practices",
    "SOC 2 report",
    "ISO 27001 certified vendor",
    "data residency",
    "subprocessors",
    "vulnerability disclosure",
  ],
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- seo`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/lib/keywords.ts src/lib/__tests__/seo.test.ts
git commit -m "feat(seo): add url helpers, metadata builder and keyword map"
```

---

### Task 9: Structured data

**Files:**
- Create: `src/lib/structured-data.ts`
- Create: `src/components/marshal/json-ld.tsx`
- Create: `src/lib/__tests__/structured-data.test.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `BRAND`, `absoluteUrl`, `faqs` from `marshal-content`
- Produces: `organizationLd()`, `softwareApplicationLd()`, `faqPageLd(faqs)`, `breadcrumbLd(trail)`, `<JsonLd data={...} />`

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/structured-data.test.ts`:

```ts
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

  it("serialises without throwing", () => {
    expect(() => JSON.stringify(organizationLd())).not.toThrow();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- structured-data`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/structured-data.ts`**

```ts
import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";

type Faq = { q: string; a: string };
type Crumb = { name: string; path: string };

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization" as const,
    name: BRAND.company,
    url: absoluteUrl("/"),
    email: BRAND.email,
    description: `${BRAND.company} builds ${BRAND.product}, ${BRAND.descriptor}.`,
  };
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication" as const,
    name: BRAND.product,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description: `${BRAND.product} is ${BRAND.descriptor} from ${BRAND.company}.`,
    publisher: { "@type": "Organization", name: BRAND.company },
  };
}

export function faqPageLd(faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
}

export function breadcrumbLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
```

- [ ] **Step 4: Create `src/components/marshal/json-ld.tsx`**

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- structured-data`
Expected: PASS, 5 tests.

- [ ] **Step 6: Mount it on the home page**

In `src/app/page.tsx`, import `JsonLd`, the three builders and `faqs`, then render inside the outer `<div>`:

```tsx
      <JsonLd data={organizationLd()} />
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={faqPageLd(faqs)} />
```

- [ ] **Step 7: Verify in the built output**

```bash
npm run build
grep -c "application/ld+json" out/index.html
```

Expected: `3`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/structured-data.ts src/components/marshal/json-ld.tsx src/lib/__tests__/structured-data.test.ts src/app/page.tsx
git commit -m "feat(seo): add Organization, SoftwareApplication and FAQ JSON-LD"
```

---

### Task 10: Sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/lib/routes.ts`
- Create: `src/lib/__tests__/routes.test.ts`

**Interfaces:**
- Consumes: `absoluteUrl` (Task 8), `FRAMEWORK_FACTS` (Task 3)
- Produces: `ALL_ROUTES: { path: string; changeFrequency: string; priority: number }[]` — the one list both the sitemap and the nav audit read.

- [ ] **Step 1: Confirm static-export support for these files**

Read `node_modules/next/dist/docs/` on `sitemap.ts` and `robots.ts` before writing. Both are supported under `output: "export"` because they are build-time generated, but confirm the expected export shape for 16.3 rather than assuming.

- [ ] **Step 2: Write the failing test**

`src/lib/__tests__/routes.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ALL_ROUTES } from "@/lib/routes";
import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";
import { compareMenu } from "@/lib/marshal-content";

describe("ALL_ROUTES", () => {
  it("has no duplicate paths", () => {
    const paths = ALL_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("starts every path with a slash", () => {
    for (const r of ALL_ROUTES) expect(r.path.startsWith("/")).toBe(true);
  });

  it("includes the home page at top priority", () => {
    const home = ALL_ROUTES.find((r) => r.path === "/");
    expect(home?.priority).toBe(1);
  });

  it("includes one route per framework", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(ALL_ROUTES.some((r) => r.path === `/frameworks/${f.slug}`)).toBe(true);
    }
  });

  it("includes one route per comparison", () => {
    expect(ALL_ROUTES.filter((r) => r.path.startsWith("/compare/"))).toHaveLength(
      compareMenu.length
    );
  });

  it("keeps every priority in range", () => {
    for (const r of ALL_ROUTES) {
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm test -- routes`
Expected: FAIL — module not found.

- [ ] **Step 4: Create `src/lib/routes.ts`**

```ts
import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";
import { compareSlug } from "@/lib/compare-content";
import { compareMenu } from "@/lib/marshal-content";

export type SiteRoute = {
  path: string;
  changeFrequency: "yearly" | "monthly" | "weekly" | "daily";
  priority: number;
};

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
  ...compareMenu.map((c) => ({
    path: `/compare/${compareSlug(c)}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
];
```

This imports `compareSlug` from Task 14. Implement Task 14 first, or stub `compareSlug` here and delete the stub when Task 14 lands — do not leave both.

- [ ] **Step 5: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { ALL_ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
```

`lastModified` is deliberately omitted: a build timestamp on every URL tells crawlers everything changed on every deploy, which is worse than saying nothing.

- [ ] **Step 6: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
```

- [ ] **Step 7: Run the tests and build**

Run: `npm test -- routes && npm run build`
Expected: tests pass; `out/sitemap.xml` and `out/robots.txt` exist.

```bash
ls out/sitemap.xml out/robots.txt
grep -c "<url>" out/sitemap.xml
```

Expected count equals `ALL_ROUTES.length`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/routes.ts src/lib/__tests__/routes.test.ts src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): generate sitemap.xml and robots.txt"
```

---

### Task 11: Page shell and 404

Sub-pages need the nav and footer without duplicating `page.tsx`'s layout.

**Files:**
- Create: `src/components/marshal/page-shell.tsx`
- Create: `src/components/marshal/__tests__/page-shell.test.tsx`
- Create: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `SiteNav`, `SiteFooter`, `breadcrumbLd` (Task 9)
- Produces: `<PageShell title, kicker, intro, crumbs, children />` — used by every page in Tasks 12–16.

- [ ] **Step 1: Write the failing test**

`src/components/marshal/__tests__/page-shell.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageShell } from "@/components/marshal/page-shell";

describe("PageShell", () => {
  it("renders the title as the only h1", () => {
    render(
      <PageShell title="Privacy" crumbs={[{ name: "Privacy", path: "/privacy" }]}>
        <p>body</p>
      </PageShell>
    );
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Privacy");
  });

  it("renders its children", () => {
    render(
      <PageShell title="Privacy" crumbs={[{ name: "Privacy", path: "/privacy" }]}>
        <p>body</p>
      </PageShell>
    );
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("emits breadcrumb structured data", () => {
    const { container } = render(
      <PageShell title="Privacy" crumbs={[{ name: "Privacy", path: "/privacy" }]}>
        <p>body</p>
      </PageShell>
    );
    const ld = container.querySelector('script[type="application/ld+json"]');
    expect(ld?.textContent).toContain("BreadcrumbList");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- page-shell`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/marshal/page-shell.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/marshal/site-nav";
import { SiteFooter } from "@/components/marshal/site-footer";
import { JsonLd } from "@/components/marshal/json-ld";
import { breadcrumbLd } from "@/lib/structured-data";

type Crumb = { name: string; path: string };

export function PageShell({
  title,
  kicker,
  intro,
  crumbs,
  children,
}: {
  title: string;
  kicker?: string;
  intro?: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <div className="bg-marshal-bg text-marshal-text min-h-screen">
      <SiteNav />
      <JsonLd data={breadcrumbLd(trail)} />

      <div className="mx-auto max-w-[1240px] px-5">
        <nav aria-label="Breadcrumb" className="pt-8">
          <ol className="text-marshal-text/55 m-0 flex list-none flex-wrap gap-2 p-0 text-xs">
            {trail.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i < trail.length - 1 ? (
                  <>
                    <Link href={c.path} className="hover:text-marshal-accent no-underline">
                      {c.name}
                    </Link>
                    <span aria-hidden>/</span>
                  </>
                ) : (
                  <span aria-current="page" className="text-marshal-text/80">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="border-marshal-divider border-b py-10">
          {kicker && (
            <p className="text-marshal-accent-300 m-0 mb-3 text-xs tracking-[0.08em] uppercase">
              {kicker}
            </p>
          )}
          <h1 className="font-heading m-0 max-w-[22ch] text-[clamp(30px,4.2vw,52px)] leading-[1.06] font-extrabold tracking-[-0.02em] uppercase">
            {title}
          </h1>
          {intro && (
            <p className="text-marshal-text/70 mt-5 max-w-[62ch] text-lg leading-relaxed">{intro}</p>
          )}
        </header>

        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- page-shell`
Expected: PASS, 3 tests.

- [ ] **Step 5: Create `src/app/not-found.tsx`**

```tsx
import Link from "next/link";
import { PageShell } from "@/components/marshal/page-shell";

export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      kicker="404"
      intro="That page has moved or never existed. The links below cover most of what people come here for."
      crumbs={[{ name: "Not found", path: "/404" }]}
    >
      <ul className="flex list-none flex-col gap-2 py-10 pl-0">
        {[
          { href: "/", label: "Home" },
          { href: "/security", label: "Security and trust" },
          { href: "/privacy", label: "Privacy policy" },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-marshal-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
```

- [ ] **Step 6: Run the full check and commit**

```bash
npm run verify
git add src/components/marshal/page-shell.tsx src/components/marshal/__tests__/page-shell.test.tsx src/app/not-found.tsx
git commit -m "feat(pages): add page shell and 404"
```

---

## Phase 4 — Legal and trust pages

### Task 12: Privacy, terms and cookies

**Files:**
- Create: `src/lib/legal-content.ts`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/cookies/page.tsx`
- Create: `src/lib/__tests__/legal-content.test.ts`
- Modify: `src/components/marshal/site-footer.tsx`

**Interfaces:**
- Consumes: `PageShell` (Task 11), `buildMetadata`, `KEYWORDS`
- Produces: `LEGAL_PAGES: Record<"privacy"|"terms"|"cookies", LegalPage>`

> **These are drafts, not legal advice.** Every page must carry a visible "under review" banner until counsel signs off. A GRC vendor shipping an unreviewed privacy policy is exactly the failure its own product exists to prevent. This is a real blocker, not boilerplate.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/legal-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { LEGAL_PAGES } from "@/lib/legal-content";
import { BRAND } from "@/lib/brand";

describe("legal pages", () => {
  it("covers privacy, terms and cookies", () => {
    expect(Object.keys(LEGAL_PAGES).sort()).toEqual(["cookies", "privacy", "terms"]);
  });

  it("marks every page as awaiting legal review", () => {
    for (const p of Object.values(LEGAL_PAGES)) {
      expect(p.reviewed).toBe(false);
    }
  });

  it("gives every page a last-updated date", () => {
    for (const p of Object.values(LEGAL_PAGES)) {
      expect(p.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("names the controller in the privacy policy", () => {
    const body = LEGAL_PAGES.privacy.sections.map((s) => s.body).join(" ");
    expect(body).toContain(BRAND.company);
  });

  it("gives every section a heading and a body", () => {
    for (const p of Object.values(LEGAL_PAGES)) {
      for (const s of p.sections) {
        expect(s.heading.length).toBeGreaterThan(0);
        expect(s.body.length).toBeGreaterThan(40);
      }
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- legal-content`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/legal-content.ts`**

```ts
import { BRAND } from "@/lib/brand";

export type LegalSection = { heading: string; body: string };
export type LegalPage = {
  title: string;
  intro: string;
  updated: string;
  /** Flip to true only once counsel has signed off. Gates the review banner. */
  reviewed: boolean;
  sections: LegalSection[];
};

export const LEGAL_PAGES: Record<"privacy" | "terms" | "cookies", LegalPage> = {
  privacy: {
    title: "Privacy policy",
    intro: `How ${BRAND.company} collects, uses and protects personal data on this website and in the ${BRAND.product} platform.`,
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Who we are",
        body: `${BRAND.company} is the controller for personal data collected through this website. For data processed inside a customer's ${BRAND.product} tenant, the customer is the controller and ${BRAND.company} is the processor, acting on documented instructions under the data processing agreement.`,
      },
      {
        heading: "What we collect",
        body: "Website: pages visited, referrer, approximate location derived from IP, and anything you type into the demo request form — name, work email, company and message. Platform: account identifiers, audit-log entries, and the configuration and evidence metadata your connected systems return.",
      },
      {
        heading: "Why we collect it",
        body: "To respond to demo requests, to provide and secure the platform, to meet our own legal and regulatory obligations, and to understand which parts of the site are useful. We do not sell personal data and we do not use it to train third-party models.",
      },
      {
        heading: "Lawful basis",
        body: "Consent for optional analytics and marketing contact. Contract for providing the platform to a customer. Legitimate interests for security monitoring and service improvement. Legal obligation where retention or disclosure is required of us.",
      },
      {
        heading: "Retention",
        body: "Demo enquiries are kept for 24 months from last contact. Platform data is kept for the life of the subscription and deleted or returned within 30 days of termination, except where law requires a longer period.",
      },
      {
        heading: "Your rights",
        body: `Depending on where you live, you may have rights of access, correction, deletion, portability, restriction and objection, and the right to withdraw consent. Write to ${BRAND.email} and we will respond within the statutory window. You may also complain to your supervisory authority.`,
      },
      {
        heading: "International transfers",
        body: "Where personal data leaves its country of origin, we rely on an approved transfer mechanism and apply the technical and organisational measures described in our security documentation.",
      },
      {
        heading: "Contact",
        body: `Privacy questions and data subject requests: ${BRAND.email}.`,
      },
    ],
  },

  terms: {
    title: "Terms of service",
    intro: `The terms governing use of this website and the ${BRAND.product} platform.`,
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Agreement",
        body: `These terms form an agreement between you and ${BRAND.company}. Using this website means you accept them. Use of the ${BRAND.product} platform is governed by the signed order form and master subscription agreement, which take precedence over these terms wherever they conflict.`,
      },
      {
        heading: "Licence",
        body: `Subject to payment and these terms, ${BRAND.company} grants a non-exclusive, non-transferable right to access ${BRAND.product} for internal business use for the subscription term.`,
      },
      {
        heading: "Acceptable use",
        body: "Do not attempt to breach or probe the platform's security outside a scope we have agreed in writing, resell access without authorisation, reverse engineer the service, or upload unlawful content.",
      },
      {
        heading: "Customer data",
        body: "Customers retain all rights in the data they connect or upload. We process it only to provide the service and as the data processing agreement directs.",
      },
      {
        heading: "Availability",
        body: "Service levels, if any, are those stated in the order form. Nothing on this website constitutes a service level commitment.",
      },
      {
        heading: "No compliance warranty",
        body: `${BRAND.product} automates evidence collection, control testing and reporting. It does not certify you, and it is not legal or audit advice. Responsibility for regulatory compliance, and for the accuracy of anything submitted to a regulator or auditor, remains with the customer.`,
      },
      {
        heading: "Limitation of liability",
        body: "To the maximum extent permitted by law, neither party is liable for indirect or consequential loss. Aggregate liability is capped at the amount stated in the order form.",
      },
      {
        heading: "Changes",
        body: "We may update these terms. Material changes will be announced on this page with a revised date.",
      },
    ],
  },

  cookies: {
    title: "Cookie policy",
    intro: "What this website stores in your browser, and how to control it.",
    updated: "2026-08-17",
    reviewed: false,
    sections: [
      {
        heading: "Strictly necessary",
        body: "A small number of entries are required for the site to function — for example the theme preference stored under 'marshal-theme' in local storage, which remembers whether you chose light or dark. These cannot be switched off and carry no tracking identifier.",
      },
      {
        heading: "Analytics",
        body: "If analytics is enabled, it records which pages are visited and how visitors arrive, in aggregate. It is loaded only after consent and can be declined without losing any functionality.",
      },
      {
        heading: "No advertising cookies",
        body: "We do not run advertising or cross-site tracking cookies, and we do not share browsing data with ad networks.",
      },
      {
        heading: "Controlling cookies",
        body: `Every major browser can block or delete cookies and clear local storage from its settings. Blocking the strictly necessary entries may reset your theme preference on each visit. Questions: ${BRAND.email}.`,
      },
    ],
  },
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- legal-content`
Expected: PASS, 5 tests.

- [ ] **Step 5: Create `src/app/privacy/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageShell } from "@/components/marshal/page-shell";
import { LEGAL_PAGES } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";

const page = LEGAL_PAGES.privacy;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.intro,
  path: "/privacy",
  keywords: KEYWORDS.privacy,
});

export default function PrivacyPage() {
  return (
    <PageShell
      title={page.title}
      kicker="Legal"
      intro={page.intro}
      crumbs={[{ name: page.title, path: "/privacy" }]}
    >
      {!page.reviewed && (
        <p
          role="note"
          className="border-marshal-accent-800 bg-marshal-section text-marshal-accent-200 mt-8 rounded-xl border px-4 py-3 text-sm"
        >
          Draft awaiting legal review — not yet a binding policy.
        </p>
      )}

      <div className="max-w-[70ch] py-10">
        <p className="text-marshal-text/55 m-0 text-xs tracking-[0.06em] uppercase">
          Last updated {page.updated}
        </p>
        {page.sections.map((s) => (
          <section key={s.heading} className="mt-9">
            <h2 className="font-heading m-0 text-xl font-semibold">{s.heading}</h2>
            <p className="text-marshal-text/75 mt-2.5 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 6: Create the terms and cookies pages**

Copy the file from Step 5 to `src/app/terms/page.tsx` and `src/app/cookies/page.tsx`. In each, change three things: `LEGAL_PAGES.privacy` → `LEGAL_PAGES.terms` / `.cookies`; the two `/privacy` strings → `/terms` / `/cookies`; `KEYWORDS.privacy` → `KEYWORDS.terms` / `KEYWORDS.cookies`; and the function name → `TermsPage` / `CookiesPage`.

- [ ] **Step 7: Link them from the footer**

Read `src/components/marshal/site-footer.tsx`, then add a legal row using `next/link`:

```tsx
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
          {[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/cookies", label: "Cookies" },
            { href: "/security", label: "Security" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-marshal-text/60 hover:text-marshal-accent text-xs no-underline transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
```

- [ ] **Step 8: Verify the pages build as static HTML**

```bash
npm run build
ls out/privacy/index.html out/terms/index.html out/cookies/index.html
```

Expected: all three exist. `trailingSlash: true` in `next.config.ts` is what produces the `/index.html` shape.

- [ ] **Step 9: Commit**

```bash
git add src/lib/legal-content.ts src/lib/__tests__/legal-content.test.ts src/app/privacy src/app/terms src/app/cookies src/components/marshal/site-footer.tsx
git commit -m "feat(pages): add privacy, terms and cookie policy drafts"
```

---

### Task 13: Security and trust page

The highest-value SEO page for a GRC vendor: buyers search "<vendor> SOC 2" and "<vendor> security" during procurement.

**Files:**
- Create: `src/app/security/page.tsx`
- Create: `e2e/legal-pages.spec.ts`

**Interfaces:**
- Consumes: `PageShell`, `buildMetadata`, `KEYWORDS.security`, `FRAMEWORK_FACTS`
- Produces: no new API

- [ ] **Step 1: Write the failing e2e test**

`e2e/legal-pages.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const pages = ["/privacy", "/terms", "/cookies", "/security"];

for (const path of pages) {
  test(`${path} renders with one h1 and a canonical`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", new RegExp(`${path}$`));
  });

  test(`${path} is reachable from the footer`, async ({ page }) => {
    await page.goto("/");
    const link = page.locator(`footer a[href$="${path}"], a[href$="${path}"]`).first();
    await expect(link).toBeVisible();
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e -- legal-pages`
Expected: FAIL on `/security` (404) — the other three pass from Task 12.

- [ ] **Step 3: Create `src/app/security/page.tsx`**

Claims here are the ones a procurement team will hold you to. Anything not yet true goes under "In progress", never under "Certifications".

```tsx
import type { Metadata } from "next";
import { PageShell } from "@/components/marshal/page-shell";
import { buildMetadata } from "@/lib/seo";
import { KEYWORDS } from "@/lib/keywords";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: `Security at ${BRAND.company}`,
  description: `How ${BRAND.product} is built, hosted and monitored: access model, encryption, data residency, subprocessors and vulnerability disclosure.`,
  path: "/security",
  keywords: KEYWORDS.security,
});

const practices = [
  {
    heading: "Access model",
    body: `${BRAND.product} connects to customer systems read-only. Cloud connectors use a role scoped to configuration and log metadata; identity connectors read directory state and never credentials. Nothing is written back to production and no agent runs on customer workloads.`,
  },
  {
    heading: "Encryption",
    body: "Data is encrypted in transit with TLS 1.2 or better, and at rest with AES-256. Connector secrets are held in a managed key vault with rotation and are never written to logs.",
  },
  {
    heading: "Tenant isolation",
    body: "Each customer tenant is logically isolated. Authorisation is checked per request against the tenant on the credential, not on a client-supplied identifier.",
  },
  {
    heading: "Monitoring and response",
    body: "Platform and infrastructure logs are centralised and retained. Alerts route to an on-call rotation with a documented incident process covering triage, customer notification and post-incident review.",
  },
  {
    heading: "Personnel",
    body: "Access to production follows least privilege and is reviewed on a schedule. Staff complete security training on joining and annually, and are screened where local law allows.",
  },
  {
    heading: "Vulnerability disclosure",
    body: `Report a suspected vulnerability to ${BRAND.email}. We acknowledge within two business days and will not pursue action against good-faith research that respects customer data and avoids service degradation.`,
  },
];

export default function SecurityPage() {
  return (
    <PageShell
      title="Security and trust"
      kicker="Trust"
      intro={`${BRAND.product} sits next to the systems that run your business. This page states plainly how it is built, what it can reach, and what it cannot.`}
      crumbs={[{ name: "Security", path: "/security" }]}
    >
      <div className="grid gap-5 py-10 md:grid-cols-2">
        {practices.map((p) => (
          <section
            key={p.heading}
            className="border-marshal-neutral-800 bg-marshal-surface rounded-2xl border p-5"
          >
            <h2 className="font-heading m-0 text-lg font-semibold">{p.heading}</h2>
            <p className="text-marshal-text/70 mt-2 text-sm leading-relaxed">{p.body}</p>
          </section>
        ))}
      </div>

      <section className="border-marshal-divider border-t py-10">
        <h2 className="font-heading m-0 text-xl font-semibold">Certifications</h2>
        <p className="text-marshal-text/70 mt-2.5 max-w-[62ch] leading-relaxed">
          Certification status is published here once each report or certificate is issued. Nothing
          is listed before it exists — ask for the current status and we will tell you where we are.
          Requests: {BRAND.email}.
        </p>
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 4: Run the e2e test to verify it passes**

Run: `npm run test:e2e -- legal-pages`
Expected: PASS, 16 (4 pages × 2 tests × 2 projects).

- [ ] **Step 5: Add `/security` to keywords if missing**

Already present in Task 8. Confirm: `grep -n "security" src/lib/keywords.ts`

- [ ] **Step 6: Run the full check and commit**

```bash
npm run verify && npm run test:e2e
git add src/app/security e2e/legal-pages.spec.ts
git commit -m "feat(pages): add security and trust page"
```

---

## Phase 5 — Programmatic SEO pages

### Task 14: Comparison pages

Turns the nine dead `href="#faq"` links in the Compare menu (`site-nav.tsx:104-112`) into nine real landing pages.

**Files:**
- Create: `src/lib/compare-content.ts`
- Create: `src/app/compare/[slug]/page.tsx`
- Create: `src/lib/__tests__/compare-content.test.ts`
- Modify: `src/components/marshal/site-nav.tsx:101-114`

**Interfaces:**
- Consumes: `BRAND`, `buildMetadata`, `PageShell`
- Produces: `compareSlug(label)`, `COMPARISONS: Comparison[]`, `getComparison(slug)`. Task 10's `routes.ts` imports `compareSlug`.

> **Comparison pages make claims about named competitors.** Everything said about a competitor must be verifiable from that competitor's own public materials, dated, and factual. No invented pricing, no invented gaps, no disparagement. This is the difference between a comparison page and a defamation exposure.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/compare-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { compareSlug, COMPARISONS, getComparison } from "@/lib/compare-content";
import { compareMenu } from "@/lib/marshal-content";

describe("compareSlug", () => {
  it("kebab-cases a menu label", () => {
    expect(compareSlug("Marshal vs Vanta")).toBe("marshal-vs-vanta");
  });

  it("handles multi-word competitors", () => {
    expect(compareSlug("Marshal vs GRC Vantage")).toBe("marshal-vs-grc-vantage");
  });

  it("handles the framework-vs-framework entry", () => {
    expect(compareSlug("NCA ECC vs SAMA CSF")).toBe("nca-ecc-vs-sama-csf");
  });
});

describe("COMPARISONS", () => {
  it("covers every menu entry", () => {
    expect(COMPARISONS).toHaveLength(compareMenu.length);
    for (const label of compareMenu) {
      expect(getComparison(compareSlug(label))).toBeDefined();
    }
  });

  it("sources every competitor claim", () => {
    for (const c of COMPARISONS) {
      for (const row of c.rows) {
        expect(row.source, `${c.slug}/${row.dimension} has no source`).toMatch(/^https?:\/\//);
      }
    }
  });

  it("gives every page a unique title and description", () => {
    const titles = COMPARISONS.map((c) => c.title);
    const descs = COMPARISONS.map((c) => c.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descs).size).toBe(descs.length);
  });

  it("keeps descriptions inside the SERP snippet budget", () => {
    for (const c of COMPARISONS) {
      expect(c.description.length).toBeGreaterThanOrEqual(70);
      expect(c.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getComparison("marshal-vs-nothing")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- compare-content`
Expected: FAIL — module not found.

- [ ] **Step 3: Research each competitor**

For each of the nine entries in `marshal-content.ts:355-365`, gather from the competitor's own public site: which frameworks they publish support for, whether they publish Arabic-language support, whether they publish NCA ECC or SAMA CSF coverage, and their stated integration count. Record the URL and the date checked for each. If a dimension cannot be sourced, drop the row — do not guess.

- [ ] **Step 4: Create `src/lib/compare-content.ts`**

```ts
import { BRAND } from "@/lib/brand";

export type CompareRow = {
  dimension: string;
  marshal: string;
  competitor: string;
  /** Public URL backing the competitor claim. Required — see the test. */
  source: string;
  checked: string;
};

export type Comparison = {
  slug: string;
  label: string;
  competitor: string;
  title: string;
  description: string;
  intro: string;
  rows: CompareRow[];
  keywords: string[];
};

export function compareSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "marshal-vs-vanta",
    label: "Marshal vs Vanta",
    competitor: "Vanta",
    title: `${BRAND.product} vs Vanta`,
    description:
      "Compare Marshal and Vanta on framework coverage, Saudi regulatory support, evidence automation and language. Sourced from public documentation.",
    intro: `Both automate evidence collection. The comparison below is limited to what each vendor publishes publicly, with the source and check date on every row.`,
    rows: [
      // One row per dimension, each with its source URL and check date from Step 3.
    ],
    keywords: ["Marshal vs Vanta", "Vanta alternative", "Vanta competitor", "GRC platform comparison"],
  },
  // ...one entry per compareMenu label.
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- compare-content`
Expected: PASS, 8 tests.

- [ ] **Step 6: Create `src/app/compare/[slug]/page.tsx`**

`generateStaticParams` is mandatory — without it a dynamic route cannot be statically exported.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/marshal/page-shell";
import { COMPARISONS, getComparison } from "@/lib/compare-content";
import { buildMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return buildMetadata({
    title: c.title,
    description: c.description,
    path: `/compare/${c.slug}`,
    keywords: c.keywords,
  });
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  return (
    <PageShell
      title={c.title}
      kicker="Compare"
      intro={c.intro}
      crumbs={[
        { name: "Compare", path: `/compare/${c.slug}` },
        { name: c.label, path: `/compare/${c.slug}` },
      ]}
    >
      <div className="overflow-x-auto py-10">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="text-marshal-text/55 mb-3 text-left text-xs">
            Every competitor claim links to that vendor&apos;s own public documentation, with the
            date it was checked.
          </caption>
          <thead>
            <tr className="border-marshal-divider border-b text-left">
              <th scope="col" className="py-2.5 pr-4 font-semibold">
                Dimension
              </th>
              <th scope="col" className="py-2.5 pr-4 font-semibold">
                {BRAND.product}
              </th>
              <th scope="col" className="py-2.5 pr-4 font-semibold">
                {c.competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.dimension} className="border-marshal-divider border-b align-top">
                <th scope="row" className="text-marshal-text/70 py-3 pr-4 text-left font-normal">
                  {r.dimension}
                </th>
                <td className="py-3 pr-4">{r.marshal}</td>
                <td className="py-3 pr-4">
                  {r.competitor}
                  <a
                    href={r.source}
                    rel="nofollow noopener"
                    target="_blank"
                    className="text-marshal-text/45 mt-1 block text-[11px]"
                  >
                    Source, checked {r.checked}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 7: Point the nav at the real pages**

In `src/components/marshal/site-nav.tsx`, import `Link` from `next/link` and `compareSlug`, then replace the Compare column's anchor (lines 104-112):

```tsx
                  {compareMenu.map((c) => (
                    <Link
                      key={c}
                      href={`/compare/${compareSlug(c)}`}
                      className="hover:bg-marshal-neutral-900 text-marshal-text rounded-lg px-2.5 py-1.5 text-sm no-underline transition-colors"
                    >
                      {c}
                    </Link>
                  ))}
```

- [ ] **Step 8: Verify all nine pages export**

```bash
npm run build
ls out/compare/
```

Expected: nine directories, each with an `index.html`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/compare-content.ts src/lib/__tests__/compare-content.test.ts src/app/compare src/components/marshal/site-nav.tsx
git commit -m "feat(seo): add nine sourced comparison pages"
```

---

### Task 15: Framework pages

Same treatment for the eight `href="#frameworks"` links at `site-nav.tsx:88-97`.

**Files:**
- Create: `src/lib/framework-content.ts`
- Create: `src/app/frameworks/[slug]/page.tsx`
- Create: `src/lib/__tests__/framework-content.test.ts`
- Modify: `src/components/marshal/site-nav.tsx:88-97`

**Interfaces:**
- Consumes: `FRAMEWORK_FACTS` (Task 3), `automationGroups`, `PageShell`, `buildMetadata`
- Produces: `FRAMEWORK_PAGES`, `getFrameworkPage(slug)`

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/framework-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { FRAMEWORK_PAGES, getFrameworkPage } from "@/lib/framework-content";
import { FRAMEWORK_FACTS } from "@/lib/compliance-facts";

describe("framework pages", () => {
  it("builds one page per verified framework", () => {
    expect(FRAMEWORK_PAGES).toHaveLength(FRAMEWORK_FACTS.length);
  });

  it("resolves by slug", () => {
    for (const f of FRAMEWORK_FACTS) {
      expect(getFrameworkPage(f.slug)?.fact.slug).toBe(f.slug);
    }
  });

  it("keeps every description inside the SERP snippet budget", () => {
    for (const p of FRAMEWORK_PAGES) {
      expect(p.description.length).toBeGreaterThanOrEqual(70);
      expect(p.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("never prints a control count for an unverified framework", () => {
    for (const p of FRAMEWORK_PAGES) {
      if (p.fact.controlCount === null) {
        expect(p.description).not.toMatch(/\d+\s+controls/);
      }
    }
  });

  it("lists at least one relevant automation per framework", () => {
    for (const p of FRAMEWORK_PAGES) {
      expect(p.automations.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- framework-content`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/framework-content.ts`**

```ts
import { FRAMEWORK_FACTS, type FrameworkFact } from "@/lib/compliance-facts";
import { automationGroups, type Automation } from "@/lib/marshal-content";
import { BRAND } from "@/lib/brand";

export type FrameworkPage = {
  fact: FrameworkFact;
  title: string;
  description: string;
  intro: string;
  automations: Automation[];
  keywords: string[];
};

/** Automations whose `maps` string mentions this framework. */
function automationsFor(fact: FrameworkFact): Automation[] {
  const needles = [fact.name, fact.name.replace("/", ""), fact.slug.replace(/-/g, " ")];
  return automationGroups
    .flatMap((g) => g.items)
    .filter((a) => needles.some((n) => a.maps.toLowerCase().includes(n.toLowerCase())))
    .slice(0, 8);
}

function describe(fact: FrameworkFact): string {
  const count =
    fact.controlCount === null
      ? `${fact.name} requirements`
      : `${fact.controlCount} ${fact.controlUnit}`;
  return `Automate ${count} with ${BRAND.product}. Continuous evidence collection, scheduled control testing and audit-ready reporting for ${fact.name}.`;
}

export const FRAMEWORK_PAGES: FrameworkPage[] = FRAMEWORK_FACTS.map((fact) => ({
  fact,
  title: `${fact.name} compliance automation`,
  description: describe(fact),
  intro: fact.summary,
  automations: automationsFor(fact),
  keywords: [
    `${fact.name} compliance`,
    `${fact.name} automation`,
    `${fact.name} controls`,
    `${fact.name} audit`,
    `${fact.name} evidence collection`,
    `${fact.name} software`,
  ],
}));

export function getFrameworkPage(slug: string): FrameworkPage | undefined {
  return FRAMEWORK_PAGES.find((p) => p.fact.slug === slug);
}
```

If `automationsFor` returns an empty array for any framework, the fifth test fails — widen the needle list or add an explicit mapping rather than deleting the assertion.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- framework-content`
Expected: PASS, 5 tests.

- [ ] **Step 5: Create `src/app/frameworks/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/marshal/page-shell";
import { FRAMEWORK_PAGES, getFrameworkPage } from "@/lib/framework-content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return FRAMEWORK_PAGES.map((p) => ({ slug: p.fact.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getFrameworkPage(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.title,
    description: p.description,
    path: `/frameworks/${p.fact.slug}`,
    keywords: p.keywords,
  });
}

export default async function FrameworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getFrameworkPage(slug);
  if (!p) notFound();

  const { fact } = p;

  return (
    <PageShell
      title={p.title}
      kicker={fact.authority}
      intro={p.intro}
      crumbs={[
        { name: "Frameworks", path: `/frameworks/${fact.slug}` },
        { name: fact.name, path: `/frameworks/${fact.slug}` },
      ]}
    >
      <dl className="border-marshal-divider grid grid-cols-2 gap-6 border-b py-8 md:grid-cols-4">
        {[
          { k: "Official name", v: fact.officialName },
          { k: "Authority", v: fact.authority },
          { k: "Region", v: fact.region },
          {
            k: fact.controlUnit,
            v: fact.controlCount === null ? "—" : String(fact.controlCount),
          },
        ].map((row) => (
          <div key={row.k}>
            <dt className="text-marshal-text/50 text-[11px] tracking-[0.06em] uppercase">{row.k}</dt>
            <dd className="text-marshal-text m-0 mt-1.5 text-sm leading-snug">{row.v}</dd>
          </div>
        ))}
      </dl>

      <section className="py-10">
        <h2 className="font-heading m-0 text-xl font-semibold">
          Automations that produce {fact.name} evidence
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {p.automations.map((a) => (
            <article
              key={a.name}
              className="border-marshal-neutral-800 bg-marshal-surface rounded-2xl border p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading m-0 text-sm font-semibold">{a.name}</h3>
                <span className="text-marshal-text/45 text-[11px] tracking-[0.05em] uppercase">
                  {a.cadence}
                </span>
              </div>
              <p className="text-marshal-text/70 mt-2 text-sm leading-relaxed">{a.what}</p>
              <p className="text-marshal-accent-300 mt-2 font-mono text-[11px]">{a.maps}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="border-marshal-divider text-marshal-text/50 border-t py-6 text-xs">
        Framework facts on this page are verified against{" "}
        <a href={fact.source} rel="noopener" target="_blank" className="text-marshal-accent-300">
          the primary source
        </a>
        .
      </p>
    </PageShell>
  );
}
```

- [ ] **Step 6: Point the nav at the real pages**

Replace `site-nav.tsx:88-97`'s `href="#frameworks"` anchors with `<Link href={/frameworks/${...}}>`. The menu list `frameworksMenu` and `FRAMEWORK_FACTS` are separate arrays — join them by name, or (better) rewrite `frameworksMenu` to derive from `FRAMEWORK_FACTS` so the two cannot drift. The "Free readiness assessment" entry has no framework fact; keep it as an in-page anchor.

- [ ] **Step 7: Verify the export**

```bash
npm run build && ls out/frameworks/
```

Expected: one directory per `FRAMEWORK_FACTS` entry.

- [ ] **Step 8: Commit**

```bash
git add src/lib/framework-content.ts src/lib/__tests__/framework-content.test.ts src/app/frameworks src/components/marshal/site-nav.tsx
git commit -m "feat(seo): add per-framework landing pages"
```

---

### Task 16: Prove no dead links remain

**Files:**
- Create: `e2e/links.spec.ts`

**Interfaces:**
- Consumes: everything above
- Produces: no new API

- [ ] **Step 1: Write the failing test**

`e2e/links.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "../src/lib/routes";

test("every internal link resolves to a real page", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /products/i }).first().hover();

  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href")!).filter((h) => h.startsWith("/"))
  );

  const unique = [...new Set(hrefs)];
  expect(unique.length).toBeGreaterThan(10);

  const broken: string[] = [];
  for (const href of unique) {
    const res = await request.get(href);
    if (res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toHaveLength(0);
});

test("no placeholder anchors survive in the mega menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /products/i }).first().hover();

  const compareLinks = await page.$$eval('a[href*="/compare/"]', (as) => as.length);
  expect(compareLinks).toBeGreaterThanOrEqual(9);

  const frameworkLinks = await page.$$eval('a[href*="/frameworks/"]', (as) => as.length);
  expect(frameworkLinks).toBeGreaterThanOrEqual(8);
});

test("every sitemap route responds", async ({ request }) => {
  const broken: string[] = [];
  for (const r of ALL_ROUTES) {
    const res = await request.get(r.path === "/" ? "/" : r.path);
    if (res.status() >= 400) broken.push(`${r.path} -> ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toHaveLength(0);
});
```

- [ ] **Step 2: Run it**

Run: `npm run test:e2e -- links`
Expected: PASS. Any failure names the exact dead href — fix the link, do not relax the assertion.

- [ ] **Step 3: Commit**

```bash
git add e2e/links.spec.ts
git commit -m "test(e2e): assert no dead internal links"
```

---

## Phase 6 — Animation

### Task 17: The Reveal primitive

**Files:**
- Create: `src/components/marshal/reveal.tsx`
- Create: `src/components/marshal/__tests__/reveal.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: `<Reveal delay?, as?, className?, children />`. Task 18 wraps every section in it.

- [ ] **Step 1: Write the failing test**

`src/components/marshal/__tests__/reveal.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/marshal/reveal";

describe("Reveal", () => {
  it("always renders its children, so content survives without JS", () => {
    render(<Reveal>visible content</Reveal>);
    expect(screen.getByText("visible content")).toBeInTheDocument();
  });

  it("marks itself revealed once observed", () => {
    // vitest.setup.ts's IntersectionObserver mock fires immediately.
    const { container } = render(<Reveal>x</Reveal>);
    expect(container.firstElementChild).toHaveAttribute("data-revealed", "true");
  });

  it("applies the requested delay", () => {
    const { container } = render(<Reveal delay={120}>x</Reveal>);
    expect((container.firstElementChild as HTMLElement).style.transitionDelay).toBe("120ms");
  });

  it("renders the requested element type", () => {
    const { container } = render(<Reveal as="section">x</Reveal>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- reveal`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/marshal/reveal.tsx`**

Opacity is driven by a `data-revealed` attribute rather than conditional mounting, so the content is in the DOM for crawlers and for anyone without JS.

```tsx
"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  as: As = "div" as ElementType,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anyone who asked for less motion gets the settled state immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      className={`marshal-reveal ${className}`}
    >
      {children}
    </As>
  );
}
```

- [ ] **Step 4: Add the CSS to `globals.css`**

Inside the `@layer utilities` block added in Task 4:

```css
  .marshal-reveal {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 620ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  .marshal-reveal[data-revealed="true"] {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .marshal-reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
```

The reduced-motion rule sets opacity to 1 unconditionally, so even if JS never runs the content is visible. That is the failure mode that matters — a broken observer must never leave the page blank.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- reveal`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/marshal/reveal.tsx src/components/marshal/__tests__/reveal.test.tsx src/app/globals.css
git commit -m "feat(motion): add the Reveal scroll primitive"
```

---

### Task 18: Animate every section

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/marshal/stat-band.tsx`, `automation-library.tsx`, `anatomy-pipeline.tsx`, `platform-disciplines.tsx`, `framework-library.tsx`, `testimonials.tsx`, `faq.tsx`, `switching-and-assessment.tsx`, `closing-cta.tsx`
- Create: `e2e/motion.spec.ts`

**Interfaces:**
- Consumes: `Reveal` (Task 17)
- Produces: no new API

- [ ] **Step 1: Wrap each home-page section**

In `src/app/page.tsx`, import `Reveal` and wrap each section component. The hero stays unwrapped — it is above the fold and must paint immediately.

```tsx
      <div className="mx-auto max-w-[1240px] px-5">
        <Hero />
        <Reveal>
          <IntegrationsStrip />
        </Reveal>
      </div>

      <Reveal>
        <StatBand />
      </Reveal>

      <div className="mx-auto max-w-[1240px] px-5">
        <Reveal>
          <AutomationLibrary />
        </Reveal>
        <Reveal>
          <AnatomyPipeline />
        </Reveal>
        <Reveal>
          <PlatformDisciplines />
        </Reveal>
        <Reveal>
          <FrameworkLibrary />
        </Reveal>
        {SHOW_TESTIMONIALS && (
          <Reveal>
            <Testimonials />
          </Reveal>
        )}
        {SHOW_FAQ && (
          <Reveal>
            <Faq />
          </Reveal>
        )}
        <Reveal>
          <SwitchingAndAssessment />
        </Reveal>
        <Reveal>
          <ClosingCta />
        </Reveal>
        <SiteFooter />
      </div>
```

- [ ] **Step 2: Stagger the card grids**

Inside the components that render a grid — `stat-band.tsx` (4 stats), `anatomy-pipeline.tsx` (4 steps), `platform-disciplines.tsx` (4 disciplines), `framework-library.tsx` (12 frameworks), `testimonials.tsx` (3 quotes) — wrap each grid child in its own `Reveal` with an index-derived delay. Cap the delay so a 12-item grid does not take 1.2s to finish:

```tsx
{items.map((item, i) => (
  <Reveal key={item.name} delay={Math.min(i * 70, 350)}>
    {/* existing card markup, unchanged */}
  </Reveal>
))}
```

Wrapping a grid child inserts a `<div>` between the grid and the card, which breaks `grid` placement. Either pass `as` to match the original child element, or move the grid item's own classes onto the `Reveal` via `className`. Verify the layout visually after each file.

- [ ] **Step 3: Write the e2e motion test**

`e2e/motion.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("sections reveal as they scroll into view", async ({ page }) => {
  await page.goto("/");
  const last = page.locator(".marshal-reveal").last();
  await expect(last).toHaveAttribute("data-revealed", "false");
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute("data-revealed", "true");
});

test("content is visible immediately under reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const first = page.locator(".marshal-reveal").first();
  await expect(first).toBeVisible();
  await expect(first).toHaveCSS("opacity", "1");
  await context.close();
});

test("no section is left invisible after a full scroll", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  const hidden = await page.$$eval(".marshal-reveal", (nodes) =>
    nodes.filter((n) => getComputedStyle(n).opacity === "0").length
  );
  expect(hidden).toBe(0);
});
```

- [ ] **Step 4: Run it**

Run: `npm run test:e2e -- motion`
Expected: PASS. The third test is the important one — it catches any section whose observer never fires, which would leave real content permanently invisible.

- [ ] **Step 5: Confirm the static HTML still carries the content**

Crawlers that do not execute JS must still see the text.

```bash
npm run build
grep -c "Leaver revocation" out/index.html
```

Expected: at least 1. If it is 0, a `Reveal` has been implemented as conditional mounting somewhere — fix it.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/marshal e2e/motion.spec.ts
git commit -m "feat(motion): reveal every section on scroll"
```

---

### Task 19: Animate the nav and page transitions

**Files:**
- Modify: `src/components/marshal/site-nav.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: `.marshal-nav-shrink` behaviour

- [ ] **Step 1: Add a scrolled state to the nav**

The nav is already `"use client"`. Add:

```tsx
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
```

and put `data-scrolled={scrolled}` on the `<nav>`, adding `transition-[padding,box-shadow] duration-200` plus `data-[scrolled=true]:py-2.5 data-[scrolled=true]:shadow-[var(--shadow-marshal-md)]` to its className.

- [ ] **Step 2: Animate the mobile drawer**

The drawer at `site-nav.tsx:157-184` mounts and unmounts abruptly. Keep it mounted and drive it with the same data-attribute pattern so it can transition both ways — replace `{mobileOpen && (` with an always-rendered element carrying `data-open={mobileOpen}` and `hidden={!mobileOpen}`, then add to `globals.css`:

```css
  .marshal-drawer {
    transform: translateY(-8px);
    opacity: 0;
    transition:
      opacity 180ms ease-out,
      transform 180ms ease-out;
  }
  .marshal-drawer[data-open="true"] {
    transform: none;
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .marshal-drawer {
      transition: none;
    }
  }
```

- [ ] **Step 3: Verify the drawer still closes**

Add to `e2e/motion.spec.ts`:

```ts
test("mobile drawer opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.locator(".marshal-drawer")).toHaveAttribute("data-open", "true");
  await page.getByRole("button", { name: /close menu/i }).click();
  await expect(page.locator(".marshal-drawer")).toBeHidden();
});
```

Run: `npm run test:e2e -- motion`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/marshal/site-nav.tsx src/app/globals.css e2e/motion.spec.ts
git commit -m "feat(motion): animate nav shrink and mobile drawer"
```

---

## Phase 7 — Logo marquee

### Task 20: Animated integrations marquee

Replaces the static wrapped pills at `integrations-strip.tsx:12-21`.

**Files:**
- Create: `src/components/marshal/logo-marquee.tsx`
- Create: `src/components/marshal/__tests__/logo-marquee.test.tsx`
- Modify: `src/components/marshal/integrations-strip.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `integrations` from `marshal-content`
- Produces: `<LogoMarquee items, speed? />`

> **Trademark note.** AWS, Okta, Datadog and the rest are third-party marks. Naming them to state a genuine integration is normally fine; imitating their logos is not. This task ships **text wordmarks only**. If the user later supplies official SVG assets — obtained from each vendor's own brand page under their brand terms — drop them into `public/logos/<slug>.svg` and the component will render them in place of the text. Do not generate look-alike logo files.

- [ ] **Step 1: Write the failing test**

`src/components/marshal/__tests__/logo-marquee.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMarquee } from "@/components/marshal/logo-marquee";

const items = ["AWS", "Okta", "Datadog"];

describe("LogoMarquee", () => {
  it("renders one accessible list of the real items", () => {
    render(<LogoMarquee items={items} />);
    const list = screen.getByRole("list", { name: /connected systems/i });
    expect(list).toBeInTheDocument();
  });

  it("duplicates the track for a seamless loop but hides the copy", () => {
    const { container } = render(<LogoMarquee items={items} />);
    const tracks = container.querySelectorAll("[data-marquee-track]");
    expect(tracks).toHaveLength(2);
    expect(tracks[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("announces each system exactly once to assistive tech", () => {
    render(<LogoMarquee items={items} />);
    // The duplicate track is aria-hidden, so each name resolves once.
    for (const name of items) {
      expect(screen.getAllByText(name).filter((n) => !n.closest("[aria-hidden=true]"))).toHaveLength(1);
    }
  });

  it("derives the duration from the item count", () => {
    const { container } = render(<LogoMarquee items={items} speed={2} />);
    const el = container.querySelector("[data-marquee]") as HTMLElement;
    expect(el.style.getPropertyValue("--marquee-duration")).toBe("6s");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- logo-marquee`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/marshal/logo-marquee.tsx`**

```tsx
/**
 * Seamless marquee: the track is rendered twice and translated by -50%, so the
 * second copy arrives exactly where the first began. Only the first copy is
 * exposed to assistive tech.
 *
 * Third-party names are rendered as text wordmarks. If official SVGs are
 * supplied under each vendor's brand terms, swap the <span> for an <img> —
 * do not synthesise imitation logos.
 */
export function LogoMarquee({ items, speed = 2 }: { items: readonly string[]; speed?: number }) {
  const duration = `${items.length * speed}s`;

  const track = (copy: number) => (
    <ul
      key={copy}
      data-marquee-track
      aria-hidden={copy === 1 ? "true" : undefined}
      aria-label={copy === 0 ? "Connected systems" : undefined}
      className="m-0 flex shrink-0 list-none items-center gap-2.5 pr-2.5"
    >
      {items.map((name) => (
        <li
          key={name}
          className="border-marshal-neutral-800 text-marshal-text/80 hover:border-marshal-accent hover:text-marshal-accent shrink-0 rounded-lg border px-[11px] py-[5px] text-sm whitespace-nowrap transition-colors"
        >
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-marquee
      style={{ "--marquee-duration": duration } as React.CSSProperties}
      className="marshal-marquee group relative overflow-hidden"
    >
      <div className="marshal-marquee-inner flex w-max">{[track(0), track(1)]}</div>
    </div>
  );
}
```

- [ ] **Step 4: Add the CSS**

In the `@layer utilities` block:

```css
  @keyframes marshal-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .marshal-marquee {
    /* Fade the entering and leaving edges so items do not pop at the boundary. */
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 6%,
      #000 94%,
      transparent 100%
    );
  }

  .marshal-marquee-inner {
    animation: marshal-marquee var(--marquee-duration, 40s) linear infinite;
  }

  .marshal-marquee:hover .marshal-marquee-inner,
  .marshal-marquee:focus-within .marshal-marquee-inner {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .marshal-marquee-inner {
      animation: none;
    }
    .marshal-marquee {
      mask-image: none;
      overflow-x: auto;
    }
  }
```

Under reduced motion the track stops and the container becomes horizontally scrollable, so every item stays reachable rather than being clipped off-screen.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- logo-marquee`
Expected: PASS, 4 tests.

- [ ] **Step 6: Use it in the strip**

Replace `integrations-strip.tsx:12-21` with `<LogoMarquee items={integrations} />` and remove the now-unused wrapper div. Keep the existing `<section aria-label="Connected systems">` and heading.

Note the duplicate accessible name: the section and the inner list would both be labelled "Connected systems". Change the section's label to "Integrations" so screen-reader users get two distinct landmarks.

- [ ] **Step 7: Verify no horizontal page overflow**

A `w-max` flex row inside `overflow-hidden` is a classic overflow bug if the wrapper's containing block is not constrained.

Run: `npm run test:e2e -- smoke`
Expected: PASS — specifically the horizontal-overflow assertion, on both desktop and mobile.

- [ ] **Step 8: Commit**

```bash
git add src/components/marshal/logo-marquee.tsx src/components/marshal/__tests__/logo-marquee.test.tsx src/components/marshal/integrations-strip.tsx src/app/globals.css
git commit -m "feat(motion): animate the integrations strip as a marquee"
```

---

## Phase 8 — Final verification

### Task 21: Full-site verification pass

**Files:**
- Create: `e2e/seo.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: everything
- Produces: no new API

- [ ] **Step 1: Write the SEO assertions**

`e2e/seo.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "../src/lib/routes";

for (const route of ALL_ROUTES) {
  test(`${route.path} has complete SEO metadata`, async ({ page }) => {
    await page.goto(route.path);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(15);
    expect(title.length).toBeLessThanOrEqual(70);

    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThanOrEqual(70);
    expect(desc!.length).toBeLessThanOrEqual(160);

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}

test("every page title is unique", async ({ page }) => {
  const titles: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route.path);
    titles.push(await page.title());
  }
  expect(new Set(titles).size, "duplicate titles across pages").toBe(titles.length);
});

test("home page carries valid JSON-LD", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => n.textContent ?? "")
  );
  expect(blocks.length).toBeGreaterThanOrEqual(3);
  for (const b of blocks) {
    expect(() => JSON.parse(b)).not.toThrow();
    expect(JSON.parse(b)["@context"]).toBe("https://schema.org");
  }
});
```

- [ ] **Step 2: Run it and fix what it names**

Run: `npm run test:e2e -- seo`
Expected: initially some failures on description length in the generated comparison/framework pages — Tasks 14 and 15 already cap these, so any failure means a specific entry drifted. Fix the content, not the test.

- [ ] **Step 3: Run the whole suite**

```bash
npm run verify && npm run test:e2e
```

Expected: lint clean, typecheck clean, all Vitest green, build succeeds, all Playwright green on both desktop and mobile.

- [ ] **Step 4: Confirm the export contains every page**

```bash
npm run build
find out -name "index.html" | wc -l
```

Expected: `ALL_ROUTES.length` + 1 (for `404.html`). Reconcile any shortfall — a missing `generateStaticParams` silently drops routes from a static export.

- [ ] **Step 5: Look at both themes at both breakpoints**

```bash
npm run dev  # separate terminal
npx playwright screenshot --viewport-size=1440,900 "http://localhost:3000/stellarglobal/" /tmp/desktop-light.png
npx playwright screenshot --viewport-size=390,844  "http://localhost:3000/stellarglobal/" /tmp/mobile-light.png
```

Open both. A green test suite does not prove the page looks right — confirm the hero panel, the marquee and the stat band each read as intended, and that nothing is clipped.

- [ ] **Step 6: Update the README**

Document: the `/stellarglobal/` dev URL and why bare `/` 404s; `npm test` / `npm run test:e2e` / `npm run verify`; the light/dark token architecture; where to change the brand name; and the standing rule that framework facts need a primary source.

- [ ] **Step 7: Final commit**

```bash
git add e2e/seo.spec.ts README.md
git commit -m "test(e2e): assert SEO metadata across every route"
```

---

## Outstanding Decisions

Flagging rather than guessing — each needs an answer before launch, none blocks implementation:

1. **`SITE_URL`** is set to `https://stellarglobal.github.io` in Task 8. If a custom domain is registered, change `SITE_URL` and set `BASE_PATH = ""`, and drop `basePath`/`assetPrefix` from `next.config.ts`.
2. **`BRAND.email`** is a placeholder (`hello@stellarglobal.com`). It appears in the privacy policy, the security page and JSON-LD.
3. **Legal review.** Every page in Task 12 ships behind an "awaiting legal review" banner and stays there until `reviewed: true`.
4. **Certifications.** Task 13 deliberately lists none. Add them only when the reports exist.
5. **OG images.** `buildMetadata` sets `summary_large_image` but no image file. A 1200×630 PNG per page type is a follow-up.
6. **Testimonials.** The three quotes at `marshal-content.ts:460-473` are placeholder. They must be replaced with attributed real quotes or removed before launch — they must not gain company names or logos while still invented.
7. **Analytics.** The cookie policy describes a consent-gated analytics tool. If none is installed, delete that section; if one is added, a consent banner is required first.

## Self-Review

**Spec coverage** — "validated as per the GRC platform" → Task 3. "Product name Marshal / from Stellar Global" → Task 2. "Light mode" → Tasks 5–7. "Pages like privacy and all the SEO related page" → Tasks 10–16. "Styles" → Tasks 5, 7, 11. "All keywords possible" → Task 8 plus the 17 targeted pages in Tasks 14–15. "Fully animated" → Tasks 17–19. "Move with the logos animation" → Task 20. Covered.

**Type consistency** — `compareSlug` is defined in Task 14 and consumed by Task 10; the ordering hazard is called out in Task 10 Step 4. `FrameworkFact` (Task 3) is imported by Tasks 10 and 15 under that exact name. `Automation` (existing, `marshal-content.ts:6`) is re-imported by Task 15. `LegalPage.reviewed` (Task 12) is read by the banner in the same task. `absoluteUrl`/`buildMetadata` (Task 8) keep their signatures throughout.

**Known ordering constraint** — Task 10 imports from Task 14. Either run Task 14 before Task 10, or use the stub noted in Task 10 Step 4.
