const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = function (commonConfig, loaders, globalsPlugin, basePath, root) {
    const webConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "index.js"),
        module: {
            rules: [
                loaders.cssLoader,
                loaders.htmlLoader,
                loaders.jsLoader,
                loaders.imgLoader
            ]
        },
        plugins: [
            globalsPlugin({browser:true}),
            new HtmlWebpackPlugin({
                title: "ToneMatrix",
                template: path.resolve(__dirname, "index.html"),
                filename: path.resolve(root, "index.html"),
            })
        ],
        output: {
            library: "tetris",
            path: basePath,
            filename: "tetris-web.js",
        },
        node: {
            fs: "empty"
        }
    });
    return webConfig;
}