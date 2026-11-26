import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    // Explicit "@/" alias: works with whichever Vite version is hoisted
    // (TinaCMS brings Vite 7, which lacks `resolve.tsconfigPaths`).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
