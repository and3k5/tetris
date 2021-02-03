//const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = function (commonConfig, loaders, globalsPlugin, basePath, root) {
    const elecConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname,"..","tetris-web","index.js"),
        target: "electron-main",
        module: {
            rules: [
                loaders.cssLoader,
                loaders.htmlLoader,
                loaders.jsLoader,
                loaders.imgLoader
            ]
        },
        plugins: [
            globalsPlugin({browser:true})
        ],
        output: {
            library: "tetris",
            path: basePath,
            filename: "tetris-electron.js",
        },
        node: {
            fs: "empty"
        }
    });
    return elecConfig;
}