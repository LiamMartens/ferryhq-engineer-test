import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["./src/utils/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [],
      exclude: [
        "**/*.{d.ts,config.ts,js,mjs,cjs}",
        "**/styled-system/**",
        "**/.storybook/**",
        "**/src/app/**",
        "**/src/types/**",
        "**/src/ui/**",
      ],
      reporter: ["text"],
    },
  },
});
