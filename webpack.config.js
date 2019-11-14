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

    var cssLoader = {
        test: /\.css$/,
        use: ["style-loader","css-loader"]
    };

    var htmlLoader = {
        test: /\.html$/,
        use: {
            loader:"html-loader",
            options: {
                attrs: [":data-src"]
            }
        }
    };

    var jsLoader = {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }
    };

    var imgLoader = {
        test: /\.svg$/,
        use: {
            loader: "file-loader",
            options: {
                outputPath: "../img"
            }
        }
    };

    const webConfig = Object.assign({}, commonConfig, {
        entry: "./src/index-browser.js",
        module: {
            rules: [
                cssLoader,
                htmlLoader,
                jsLoader,
                imgLoader
            ]
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode,{browser:true}))
        ],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "js"),
            filename: "tetris-web.js",
        },
        node: {
            fs: "empty"
        }
    });

    const nodeConfig = Object.assign({}, commonConfig, {
        entry: "./src/index-node.js",
        target: "node",
        module: {
            rules: [
                jsLoader,
            ]
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode,{node:true}))
        ],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "js"),
            filename: "tetris-node.js",
        }
    });

    const logServerConfig = Object.assign({}, commonConfig, {
        entry: "./src/index-logserver.js",
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
            path: path.resolve(__dirname, "js"),
            filename: "tetris-logserver.js",
        }
    });

    return [
        webConfig,
        nodeConfig,
        logServerConfig
    ];
}