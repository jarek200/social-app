import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL("./", import.meta.url));
const fromRoot = (path: string) => resolve(rootDir, path);

export default defineConfig({
  root: rootDir,
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}", "src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
  resolve: {
    alias: {
      "@components": fromRoot("src/components"),
      "@pages": fromRoot("src/pages"),
      "@stores": fromRoot("src/stores"),
      "@utils": fromRoot("src/utils"),
      "@layouts": fromRoot("src/layouts"),
      "@config": fromRoot("src/config"),
      "@services": fromRoot("src/services"),
      "@web": fromRoot("src"),
    },
  },
});
