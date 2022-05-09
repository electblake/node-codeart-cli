module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)', '**/__tests__/**/*.mjs'],
  moduleNameMapper: {
    chalk: require.resolve('chalk'),
    '#ansi-styles': require.resolve('ansi-styles/index.js'),
    '#supports-color': require.resolve('supports-color/index.js'),
  },
}
