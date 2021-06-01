module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    ignorePatterns: [
        'public/',
        'development/',
        'rollup.production.js'
    ],
    globals: {
        RequestInit: 'readonly',
        HeadersInit: 'readonly'
    },
    env: {
        browser: true, // makes HTMLElement and customElements NOT no-undef
        es2021: true,
        'shared-node-browser': true
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'standard'
    ],
    rules: {
        indent: 'off',
        semi: 'off',
        camelcase: 'off',
        'space-before-function-paren': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'prefer-spread': 'off',
        'no-useless-call': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
    }
}
