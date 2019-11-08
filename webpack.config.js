const webpack = require('webpack');
const path = require('path');

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
                presets: ["@babel/preset-env"]
            }
        }
    };

    const webConfig = Object.assign({}, commonConfig, {
        entry: "./src/index-browser.js",
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader","css-loader"]
                },
                {
                    test: /\.html$/,
                    use: {
                        loader:"html-loader",
                        options: {
                            attrs: [":data-src"]
                        }
                    }
                },
                jsLoader,
                {
                    test: /\.svg$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            outputPath: "../img"
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                "global.development": mode === "development",
                "global.production": mode === "production",
                "global.mode": mode,
                "global.browser": true,
                "global.node": false
            })
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
            new webpack.DefinePlugin({
                "global.development": mode === "development",
                "global.production": mode === "production",
                "global.mode": mode,
                "global.browser": false,
                "global.node": true
            })
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
            new webpack.DefinePlugin({
                "global.development": mode === "development",
                "global.production": mode === "production",
                "global.mode": mode
            })
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