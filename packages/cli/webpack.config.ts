import path from "path";
import { default as webpack, Configuration } from "webpack";

function globals(mode: string, opts: { browser?: boolean; node?: boolean }) {
    return {
        "global.development": mode === "development",
        "global.production": mode === "production",
        "global.mode": mode,
        "global.browser": opts.browser === true,
        "global.node": opts.node === true,
    };
}

module.exports = function (env: { mode: any; watch: string }) {
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

    const nodeConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "src", "index.ts"),
        target: "node",
        module: {
            rules: [tsLoader],
        },
        plugins: [new webpack.DefinePlugin(globals(mode, { node: true }))],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-node.js",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core/src/index.ts"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },
    });

    return nodeConfig;
};
