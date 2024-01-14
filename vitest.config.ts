import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: [],
      exclude: [
        "**/*.{d.ts,config.ts,js,mjs,cjs}",
        "**/index.ts",
        "**/styled-system/**",
        "**/.storybook/**",
        "**/.next/**",
        "**/src/app/**",
        "**/src/types/**",
        "**/src/ui/**",
      ],
      reporter: ["text", "json", "html"],
    },
  },
});
