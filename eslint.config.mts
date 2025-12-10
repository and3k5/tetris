import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import { resolve } from "path";

export default defineConfig([
    globalIgnores(["**/package-lock.json"], "Ignore package-lock.json"),
    globalIgnores(["**/dist/*"], "Ignore dist"),
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: resolve(__dirname),
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector: "ExportNamedDeclaration[source]",
                    message:
                        "Exporting named bindings using `export { ... } from '...'` is not allowed.",
                },
                {
                    selector: "ExportNamespaceSpecifier",
                    message: "Exporting named bindings using `export * from '...'` is not allowed.",
                },
                {
                    // only match named specifiers inside a re-export (child selector)
                    selector: "ExportNamedDeclaration[source] > ExportSpecifier",
                    message:
                        "Re-exporting named bindings using `export { ... } from '...'` is not allowed.",
                },
                {
                    // only match namespace specifier inside a re-export
                    selector: "ExportNamedDeclaration[source] > ExportNamespaceSpecifier",
                    message:
                        "Re-exporting namespace bindings using `export * as ns from '...'` is not allowed.",
                },
                {
                    // match `export * from 'x'`
                    selector: "ExportAllDeclaration",
                    message:
                        "Re-exporting all bindings using `export * from '...'` is not allowed.",
                },
            ],
        },
    },
    tseslint.configs.recommended,
    {
        basePath: "packages/cli",
        extends: [
            globalIgnores(["dist/**/*"], "Ignore dist"),
            {
                languageOptions: {
                    parserOptions: {
                        tsconfigRootDir: resolve(__dirname, "workspaces/cli"),
                    },
                },
            },
        ],
    },
    {
        basePath: "packages/core",
        extends: [
            globalIgnores(["dist/**/*"], "Ignore dist"),
            {
                languageOptions: {
                    parserOptions: {
                        tsconfigRootDir: resolve(__dirname, "workspaces/core"),
                    },
                },
            },
        ],
    },
    // {
    //     basePath: "packages/electron",
    //     extends: [
    //         globalIgnores(["dist/**/*"], "Ignore dist"),
    //         {
    //             languageOptions: {
    //                 parserOptions: {
    //                     tsconfigRootDir: resolve(__dirname, "workspaces/electron"),
    //                 },
    //             },
    //         },
    //     ],
    // },
    {
        basePath: "packages/log-server",
        extends: [
            globalIgnores(["dist/**/*"], "Ignore dist"),
            {
                languageOptions: {
                    parserOptions: {
                        tsconfigRootDir: resolve(__dirname, "workspaces/log-server"),
                    },
                },
            },
        ],
    },
    {
        basePath: "packages/web",
        extends: [
            globalIgnores(["dist/**/*"], "Ignore dist"),
            {
                languageOptions: {
                    parserOptions: {
                        tsconfigRootDir: resolve(__dirname, "workspaces/web"),
                    },
                },
            },
        ],
    },
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        rules: {
            "css/no-important": "warn",
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.json5"],
        plugins: { json },
        language: "json/json5",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
    },
]);
