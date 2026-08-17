import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { BASE_PATH } from "@/lib/asset";

/**
 * The origin was wrong once already — "stellarglobal.github.io" instead of
 * "shinishgreenenergy-lgtm.github.io". Nothing breaks visibly when that
 * happens; the site renders and every canonical quietly points somewhere
 * else. This derives the expected value from the git remote so the mistake
 * cannot come back.
 */
function remoteOwnerAndRepo(): { owner: string; repo: string } | null {
  try {
    const remote = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const m = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/);
    return m ? { owner: m[1], repo: m[2] } : null;
  } catch {
    return null;
  }
}

describe("SITE_URL", () => {
  const remote = remoteOwnerAndRepo();

  it.skipIf(!remote)("uses the repo owner as the GitHub Pages origin", () => {
    expect(SITE_URL).toBe(`https://${remote!.owner}.github.io`);
  });

  it.skipIf(!remote)("uses the repo name as the basePath", () => {
    expect(BASE_PATH).toBe(`/${remote!.repo}`);
  });

  it("builds the live project-site url", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}${BASE_PATH}`);
  });

  it("is https and has no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL).not.toMatch(/\/$/);
  });
});
