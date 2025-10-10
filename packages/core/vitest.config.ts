import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        name: "core",
        environment: "node",
        include: ["src/**/*-spec.ts", "src/**/*-Spec.ts"],
        exclude: [...configDefaults.exclude],
        root: __dirname,
    },
    resolve: {
        alias: {},
    },
});
