import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack, { Configuration } from "webpack";
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

module.exports = function ({ mode = "production" }: { mode: "production" | "development" }) {
    const commonConfig: Partial<Configuration> = {
        mode: mode,
    };

    if (mode === "development") {
        commonConfig.devtool = "inline-source-map";
    }

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

    const tsLoader = {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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

    const webConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "src", "index.ts"),
        module: {
            rules: [cssLoader, htmlLoader, tsLoader, imgLoader],
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode, { browser: true })),
            new HtmlWebpackPlugin({
                title: "ToneMatrix",
                template: path.resolve(__dirname, "src", "index.html"),
                filename: path.resolve(__dirname, "dist", "index.html"),
            }),
        ],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-web.js",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core/src/index.ts"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },
    });
    return webConfig;
};
