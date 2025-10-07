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
    const mode = env.mode;

    const commonConfig = {
        mode: mode,
        watch: env.watch === "yes",
    };

    const tsLoader =  {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    };

    const logServerConfig = Object.assign({}, commonConfig, {
        entry: "./src/index.ts",
        target: "node",
        module: {
            rules: [
                tsLoader
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
                "@tetris/core": path.resolve(__dirname, "../core/src/index.ts")
            }
        }
    });

    return logServerConfig;
}