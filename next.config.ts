import type { NextConfig } from "next";

// Static export for GitHub Pages. No custom domain is configured for this
// repo, so the site is served at a subpath (github.io/stellarglobal) rather
// than the domain root — basePath/assetPrefix account for that.
const REPO_BASE_PATH = "/stellarglobal";

const nextConfig: NextConfig = {
  output: "export",
  basePath: REPO_BASE_PATH,
  assetPrefix: REPO_BASE_PATH,
  trailingSlash: true,
  images: {
    // GitHub Pages serves static files only — no server to run the Image
    // Optimization API. Unused today (no next/image calls yet) but set for
    // when the real hero screenshot is added.
    unoptimized: true,
  },
};

export default nextConfig;
