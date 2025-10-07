const webpack = require("webpack");
const path = require("path");

function globals(mode, opts) {
    return {
        "global.development": mode === "development",
        "global.production": mode === "production",
        "global.mode": mode,
        "global.browser": opts.browser === true,
        "global.node": opts.node === true,
    };
}

module.exports = function (env) {
    const mode = env.mode;

    const commonConfig = {
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

    const elecConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "../web/src", "index.ts"),
        target: "electron-main",
        module: {
            rules: [cssLoader, htmlLoader, imgLoader],
        },
        plugins: [new webpack.DefinePlugin(globals(mode, { browser: true }))],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-electron.js",
        },
        node: {
            fs: "empty",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core"),
            },
        },
    });
    return elecConfig;
};
