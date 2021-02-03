module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "chrome": "58",
                    "ie": "11",
                    "safari": "9"
                }
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-private-property-in-object"
    ]
};
