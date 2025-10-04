const path = require("path");

module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "babelOptions": {
            "configFile": path.resolve(__dirname, "babel.config.js")
        }
    },
    "rules": {}
}