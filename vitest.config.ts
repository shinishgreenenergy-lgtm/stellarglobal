import { defineConfig } from "vitest/config";
import path from "node:path";

// No @vitejs/plugin-react here on purpose: its v6 line requires @babel/core 8,
// while shadcn pins @babel/core 7, and the two cannot co-resolve. The plugin
// only buys Fast Refresh, which tests do not use — esbuild handles the JSX
// transform on its own from tsconfig's "jsx": "react-jsx".
export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
