var webpackConfig = require("./webpack.config.js");

module.exports = (config) => {
    config.set({
        frameworks: ['jasmine'],
        // ... normal karma configuration
        files: [
            // all files ending in "_test"
            { pattern: 'src/test/*-test.js', watched: false },
            { pattern: 'src/test/**/*-test.js', watched: false },
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/test/*-test.js': ['webpack'],
            'src/test/**/*-test.js': ['webpack'],
        },

        webpack: webpackConfig({mode: "development"}),

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only',
        },
    });
};
