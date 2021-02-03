const path = require("path");
const webpack = require("webpack");

function globals(mode,opts) {
    return {
        "global.development": mode === "development",
        "global.production": mode === "production",
        "global.mode": mode,
        "global.browser": opts.browser === true,
        "global.node": opts.node === true
    };
}

module.exports = function (env) {

    var mode = env.mode;

    const commonConfig = {
        mode: mode,
        watch: env.watch === "yes",
    };

    var jsLoader = {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                root: "../../"
            }
        }
    };

    const nodeConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "src", "index.js"),
        target: "node",
        module: {
            rules: [
                jsLoader,
            ]
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode, {node:true})),
        ],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-node.js",
        }
    });

    return nodeConfig;
}
