var HtmlWebpackPlugin = require('html-webpack-plugin');
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

    const createGlobals = function (modifications) {
        return new webpack.DefinePlugin(globals(mode,modifications))
    }
    const destPath = path.resolve(__dirname, "js");

    const createWebConfig = require("./tetris-web/webpack.config");
    const webConfig = createWebConfig(commonConfig, { cssLoader,htmlLoader,jsLoader,imgLoader }, createGlobals, destPath, __dirname);

    const createElecConfig = require("./tetris-electron/webpack.config");
    const elecConfig = createElecConfig(commonConfig, { cssLoader,htmlLoader,jsLoader,imgLoader }, createGlobals, destPath, __dirname);


    
    const createNodeConfig = require("./tetris-cli/webpack.config");
    const nodeConfig = createNodeConfig(commonConfig, { jsLoader }, createGlobals, destPath, __dirname);

    //console.log(nodeConfig);

    return [
        webConfig,
        elecConfig,
        nodeConfig,
        logServerConfig
    ];
}