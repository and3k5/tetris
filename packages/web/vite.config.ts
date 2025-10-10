import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => ({
    plugins: [vue()],
    define: {
        global: {
            development: mode === "development",
            production: mode === "production",
            mode: mode,
            browser: true,
            node: false,
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@tetris/core": resolve(__dirname, "../core/src"),
        },
    },
}));
