import { fileURLToPath } from "node:url";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        name: "web",
        environment: "jsdom",
        include: ["src/**/*-spec.ts", "src/**/*-Spec.ts"],
        exclude: [...configDefaults.exclude],
        root: fileURLToPath(new URL("./", import.meta.url)),
        browser: {
            enabled: true,
            provider: "playwright",
            instances: [
                {
                    headless: true,
                    browser: "chromium",
                },
                {
                    headless: true,
                    browser: "firefox",
                },
                // {
                //     headless: true,
                //     browser: "webkit",
                // },
            ],
        },
    },
});
