module.exports = {
    "env": {
        "es6": true,
        "node": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["warn", 2],
        "linebreak-style": ["error", "unix"],
        "no-console": "off",
        "semi": "off",
        "babel/semi": ["error", "always"],

        "comma-dangle": ["warn", {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "always-multiline",
        }],

        "space-infix-ops": "warn",
    },
    "plugins": [
      "babel",
    ],
};
