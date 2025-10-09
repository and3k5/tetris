import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => ({
    plugins: [vue()],
    root: "../web",
    define: {
        global: {
            development: mode === "development",
            production: mode === "production",
            mode: mode,
            browser: true,
            node: false,
        },
    },
    build: {
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: resolve(__dirname, "../web/index.html"),
        },
    },
    resolve: {
        alias: {
            "@tetris/core": resolve(__dirname, "../core/src"),
        },
    },
}));
