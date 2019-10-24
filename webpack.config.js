const webpack = require('webpack');
const path = require('path');

module.exports = function (env) {
    var mode = env.mode;

    const commonConfig = {
        mode: mode,
        plugins: [
            new webpack.DefinePlugin({
                "global.development": mode === "development",
                "global.production": mode === "production",
                "global.mode": mode
            })
        ],
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

    const mainConfig = Object.assign({}, commonConfig, {
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
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "js"),
            filename: "tetris.js",
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
        output: {
            library: "tetris-logserver",
            path: path.resolve(__dirname, "js"),
            filename: "tetris-logserver.js",
        }
    });

    return [
        mainConfig,
        //logServerConfig
    ];
}