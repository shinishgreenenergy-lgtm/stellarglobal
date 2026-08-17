import type { NextConfig } from "next";

/**
 * Static export, deployed to two hosts with different roots.
 *
 *   Netlify      → served at the root, so no basePath (the default)
 *   GitHub Pages → project sites live at /<repo>, so basePath is required
 *
 * The GitHub Pages build sets NEXT_PUBLIC_BASE_PATH=/stellarglobal (see the
 * `deploy:pages` script). Everything else — Netlify, `next dev`, the test
 * suite — runs at the root.
 *
 * Keep this in step with BASE_PATH in src/lib/asset.ts, which reads the same
 * variable. A test asserts the two agree.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  // Omitted entirely when empty — Next requires basePath to begin with "/".
  ...(BASE_PATH ? { basePath: BASE_PATH, assetPrefix: BASE_PATH } : {}),
  trailingSlash: true,
  images: {
    // GitHub Pages and Netlify both serve static files only — no server to
    // run the Image Optimization API.
    unoptimized: true,
  },
};

export default nextConfig;
