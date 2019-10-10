const path = require('path');

module.exports = function (env) {
    var mode = env.mode;

    const commonConfig = {
        mode: mode,
    };

    const mainConfig = Object.assign({}, commonConfig, {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader","css-loader"]
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