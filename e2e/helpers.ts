/**
 * URL helpers for the e2e suite.
 *
 * Playwright resolves `goto()` with `new URL(path, baseURL)`, so a leading
 * slash discards any path component of baseURL: with baseURL
 * "http://localhost:3000/stellarglobal", `goto("/")` silently lands on
 * "http://localhost:3000/" — which this app 404s. That 404 page has an <h1>,
 * so naive smoke assertions pass against it and the suite looks green while
 * testing nothing. baseURL is therefore the bare origin, and every navigation
 * goes through `url()`.
 */
export const BASE_PATH = "/stellarglobal";

/** Map a site-relative path ("/privacy") to a full path including basePath. */
export function url(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${BASE_PATH}/${clean}` : `${BASE_PATH}/`;
}
