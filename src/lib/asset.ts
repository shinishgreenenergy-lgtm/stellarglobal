/**
 * The deployed basePath. MUST stay in step with next.config.ts.
 *
 * Next does not prepend basePath to next/image `src`, to raw <img src>, or to
 * CSS url() — the framework docs are explicit that you add it yourself
 * (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/basePath.md).
 * It IS prepended automatically to <Link href> and router navigations.
 *
 * Every reference to a file in public/ therefore goes through asset().
 */
export const BASE_PATH = "/stellarglobal";

/** Resolve a path in public/ to its served URL, including the basePath. */
export function asset(path: string): string {
  return `${BASE_PATH}/${path.replace(/^\/+/, "")}`;
}
