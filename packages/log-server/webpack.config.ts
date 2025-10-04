const webpack = require('webpack');
const path = require('path');

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

    const logServerConfig = Object.assign({}, commonConfig, {
        entry: "./src/index.js",
        target: "node",
        module: {
            rules: [
                jsLoader
            ]
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode,{node:true}))
        ],
        output: {
            library: "logserver",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-logserver.js",
        },
        resolve: {
            alias: {
                "@tetris/core": path.resolve(__dirname, "../core")
            }
        }
    });

    return logServerConfig;
}