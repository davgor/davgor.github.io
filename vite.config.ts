/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "fs";
import { resolve } from "path";

// https://vitejs.dev/config/
const basePath = process.env.BASE || process.env.VITE_BASE || "/";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "create-nojekyll",
      closeBundle() {
        const outDir = resolve(__dirname, "dist");
        writeFileSync(resolve(outDir, ".nojekyll"), "");
      },
    },
  ],
  base: basePath,
  build: {
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
