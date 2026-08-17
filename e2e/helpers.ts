/**
 * URL helpers for the e2e suite.
 *
 * Playwright resolves `goto()` with `new URL(path, baseURL)`, so a leading
 * slash discards any path component of baseURL. When this project still had a
 * hardcoded basePath, `goto("/")` silently landed on the bare root and every
 * test ran against the 404 page — which has an <h1>, so the suite looked
 * green while testing nothing. baseURL is the bare origin and all navigation
 * goes through `url()`.
 *
 * BASE_PATH mirrors NEXT_PUBLIC_BASE_PATH, so the same suite can run against
 * a root deploy (Netlify, dev) or a subpath one (GitHub Pages).
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Map a site-relative path ("/privacy") to a full path including basePath. */
export function url(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${BASE_PATH}/${clean}` : `${BASE_PATH}/`;
}

/**
 * The href next/link actually renders for a site-relative path.
 *
 * next.config.ts sets `trailingSlash: true`, so emitted hrefs end in "/" —
 * an exact-match selector built from url() alone never matches.
 */
export function hrefFor(path: string): string {
  const u = url(path);
  return u.endsWith("/") ? u : `${u}/`;
}
