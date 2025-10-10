import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        projects: ["packages/web/vitest.config.ts", "packages/core/vitest.config.ts"],
    },
});
