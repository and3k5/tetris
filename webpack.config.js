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
        ]
    };

    const mainConfig = Object.assign({}, commonConfig, {
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
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                },
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
        watch: env.watch === "yes",
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "js"),
            filename: "tetris.js",
        }
    });

    return [
        mainConfig,
    ];
}