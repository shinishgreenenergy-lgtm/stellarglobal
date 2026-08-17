/**
 * Deployment path configuration.
 *
 * This site is served from two hosts that disagree about where the root is:
 *
 *   Netlify           → https://stellar-global-india.netlify.app/   (root)
 *   GitHub Pages      → https://<owner>.github.io/stellarglobal/    (subpath)
 *
 * A GitHub Pages *project* site can only be served from /<repo>, so it needs
 * `basePath`. Netlify serves the exported folder at the root, so a basePath
 * there makes every asset request 404 — the page renders as unstyled HTML
 * with no JS, which is exactly what happened before this was made
 * configurable.
 *
 * Root is therefore the default: it is what Netlify needs, and it is what
 * makes http://localhost:3000/ work in development. The GitHub Pages build
 * opts in by setting NEXT_PUBLIC_BASE_PATH — see the `deploy:pages` script.
 *
 * NEXT_PUBLIC_ prefix is required: Next inlines these at build time, so the
 * value is available inside client components. A bare env var would be
 * undefined in the browser.
 *
 * next.config.ts reads the same variable. The two must agree, and a test
 * asserts they do.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Resolve a path in public/ to its served URL.
 *
 * Next does NOT prepend basePath to next/image `src`, raw `<img src>` or CSS
 * url() — the docs are explicit that you add it yourself. Every reference to
 * a file in public/ goes through here.
 */
export function asset(path: string): string {
  return `${BASE_PATH}/${path.replace(/^\/+/, "")}`;
}
