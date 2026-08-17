# Marshal — marketing site

Marketing site for **Marshal**, the automation-first GRC platform from **Stellar Global**.

Next.js 16 App Router, static-exported to GitHub Pages.

## Running it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000/stellarglobal/**

> `http://localhost:3000/` returns 404 by design. `next.config.ts` sets
> `basePath: "/stellarglobal"` so the site can be served from a GitHub Pages
> subpath, and the basePath applies in development too. Nothing is mounted at
> the bare root.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `/stellarglobal/` |
| `npm run build` | Static export to `out/` |
| `npm test` | Vitest — unit and component tests |
| `npm run test:e2e` | Playwright — desktop and mobile |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | lint + typecheck + unit tests + build |
| `npm run deploy` | Build and publish `out/` to GitHub Pages |

Run `npm run verify && npm run test:e2e` before pushing.

## Things that will bite you

**basePath is not applied to assets.** Next prepends `basePath` to `<Link href>`
and router navigations, but **not** to `next/image` `src`, raw `<img src>`, or
CSS `url()`. Every reference to a file in `public/` must go through
`asset()` in `src/lib/asset.ts`, or it renders broken. `BASE_PATH` there must
stay in step with `next.config.ts` — a test asserts this.

**Absolute URLs for crawlers.** Canonicals, OpenGraph, JSON-LD and the sitemap
need a full origin. Use `absoluteUrl()` from `src/lib/seo.ts`, never a bare
path.

**e2e navigation goes through `url()`.** `e2e/helpers.ts` exists because
Playwright resolves `goto()` with `new URL(path, baseURL)`, so a leading slash
discards the basePath and silently lands on the 404 page — which has an `<h1>`,
so naive assertions pass against it. `baseURL` is the bare origin; always
navigate with `url("/some/path")`.

**Dynamic routes need `generateStaticParams`.** Under `output: "export"` a
dynamic segment without it is dropped from the build silently rather than
failing.

## Theme

Light only. `src/app/globals.css` defines the whole palette as `--marshal-*`
properties on `:root`, which Tailwind's `@theme` maps to `bg-marshal-*`,
`text-marshal-*` and `border-marshal-*` utilities.

There is no dark theme and no toggle. The vendored shadcn primitives in
`src/components/ui` ship `dark:` utilities, so `@custom-variant dark` is bound
to a class that is never applied — otherwise Tailwind's built-in `dark:`
variant would fire on a visitor's dark OS and half-darken the UI.

Accent colour has two jobs: `--marshal-accent` (`#a87a22`) is for fills, dots,
borders and focus rings; **accent text uses `accent-300`** (`#86621f`), because
the brighter value is only ~3.6:1 on the paper ground. `e2e/contrast.spec.ts`
enforces WCAG AA across the page.

## Content rules

These are enforced by tests, not conventions.

**Framework facts need a primary source.** `src/lib/compliance-facts.ts` is the
single source of truth for framework names and control counts, and every entry
carries the URL it was verified against. Anything unconfirmed gets
`controlCount: null` and renders as "—". Two counts inherited from the original
design handoff were wrong and were corrected here (NCA CSCC 85 → 32, SAMA CSF
250 → 118).

**Marketing claims are still placeholder.** The header of
`src/lib/marshal-content.ts` lists what has not been verified — the automation
counts, the percentages, the time-to-certification figure, and all three
testimonials. These must be confirmed or removed before launch.

**Competitor claims need a source and a date.** `src/lib/compare-content.ts`
states Marshal's own position only. A row may not carry a `competitor` value
without a `source` URL and a `checked` date, and a page that is not fully
sourced stays `indexed: false` — out of the sitemap and `noindex` — so
half-filled tables cannot read as doorway pages.

**Legal pages are drafts.** Each renders an "awaiting legal review" banner
while `reviewed: false` in `src/lib/legal-content.ts`. The security page lists
no certifications; add them when the reports exist.

## Before launch

- [ ] Point `SITE_URL` in `src/lib/seo.ts` at the real domain (currently
      `stellarglobal.github.io`). If a custom domain is used, also set
      `BASE_PATH` to `""` and drop `basePath`/`assetPrefix` from `next.config.ts`.
- [ ] Replace `BRAND.email` in `src/lib/brand.ts` — it appears in the privacy
      policy, the security page and the JSON-LD.
- [ ] Legal review of `/privacy`, `/terms`, `/cookies`, then flip `reviewed`.
- [ ] Replace or remove the three placeholder testimonials.
- [ ] Confirm or correct the unverified marketing numbers.
- [ ] Add OG images (metadata declares `summary_large_image` but no file yet).
- [ ] Source the competitor columns, then flip `indexed` and add the paths to
      `src/lib/routes.ts`.
