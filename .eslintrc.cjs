module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:jsdoc/recommended'],
  plugins: ['jsdoc'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'max-len': ['warn', 120],
  },
}
