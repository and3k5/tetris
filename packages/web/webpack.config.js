const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require("path");

function globals(mode,opts) {
    return {
        "global.development": mode === "development",
        "global.production": mode === "production",
        "global.mode": mode,
        "global.browser": opts.browser === true,
        "global.node": opts.node === true
    };
}


module.exports = function ({mode = "production"}) {

    const commonConfig = {
        mode: mode,
    };

    if (mode === "development") {
        commonConfig.devtool = "inline-source-map";
    }

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
                root: "../../"
            }
        }
    };

    var imgLoader = {
        test: /\.svg$/,
        use: {
            loader: "file-loader",
            options: {
                outputPath: "img"
            }
        }
    };

    const webConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "src", "index.js"),
        module: {
            rules: [
                cssLoader,
                htmlLoader,
                jsLoader,
                imgLoader
            ]
        },
        plugins: [
            new webpack.DefinePlugin(globals(mode, {browser:true})),
            new HtmlWebpackPlugin({
                title: "ToneMatrix",
                template: path.resolve(__dirname, "src", "index.html"),
                filename: path.resolve(__dirname, "dist", "index.html"),
            })
        ],
        output: {
            library: "tetris",
            path: path.resolve(__dirname, "dist"),
            filename: "tetris-web.js",
        },
        node: {
            fs: "empty"
        }
    });
    return webConfig;
}