module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        "airbnb-base",
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "space-before-function-paren": ["error", "always"],
        allowEmptyReject: "off",
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        "no-unused-vars": "warn",
        "object-curly-newline": ["error", {
            ImportDeclaration: "never",
        }],
        "class-methods-use-this": "off",
        "prefer-promise-reject-errors": "warn",
        "no-param-reassign": ["error", { props: false }],
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
        "no-shadow": "warn",
        "max-len": "off",
    },
};
