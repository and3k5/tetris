import { default as webpack, Configuration } from "webpack";
import path from "path";

function globals(mode: string, opts: { browser?: boolean; node?: boolean }) {
    return {
        "global.development": mode === "development",
        "global.production": mode === "production",
        "global.mode": mode,
        "global.browser": opts.browser === true,
        "global.node": opts.node === true,
    };
}

export default function (env: { mode: any; watch: string }) {
    const mode = env.mode;

    const commonConfig: Partial<Configuration> = {
        mode: mode,
        watch: env.watch === "yes",
    };

    const tsLoader = {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
    };

    const logServerConfig = Object.assign({}, commonConfig, {
        entry: "./src/index.ts",
        target: "node",
        module: {
            rules: [tsLoader],
        },
        plugins: [new webpack.DefinePlugin(globals(mode, { node: true }))],
        output: {
            library: "logserver",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-logserver.js",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core/src/index.ts"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },
    });

    return logServerConfig;
}
