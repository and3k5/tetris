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

module.exports = function (env: { mode: "development" | "production"; watch: string }) {
    const mode = env.mode;

    const commonConfig: Partial<Configuration> = {
        mode: mode,
        watch: env.watch === "yes",
    };

    const cssLoader = {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
    };

    const htmlLoader = {
        test: /\.html$/,
        use: {
            loader: "html-loader",
            options: {
                attrs: [":data-src"],
            },
        },
    };

    const imgLoader = {
        test: /\.svg$/,
        use: {
            loader: "file-loader",
            options: {
                outputPath: "img",
            },
        },
    };

    const tsLoader = {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
    };

    const elecConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "../web/src", "index.ts"),
        target: "electron-main",
        module: {
            rules: [cssLoader, htmlLoader, imgLoader, tsLoader],
        },
        plugins: [new webpack.DefinePlugin(globals(mode, { browser: true }))],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-electron.js",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core/src"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },
    });
    return elecConfig;
};
