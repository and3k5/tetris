const path = require("path");

module.exports = function (commonConfig, loaders, globalsPlugin, basePath, root) {
    const jsLoader = loaders.jsLoader;

    const nodeConfig = Object.assign({}, commonConfig, {
        entry: path.resolve(__dirname, "index.js"),
        target: "node",
        module: {
            rules: [
                jsLoader,
            ]
        },
        plugins: [
            globalsPlugin({node:true})
        ],
        output: {
            library: "tetris",
            path: basePath,
            filename: "tetris-node.js",
        }
    });

    return nodeConfig;
}
