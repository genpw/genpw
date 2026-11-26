module.exports = {
  extends: ['@mi11er'],
  overrides: [
    {
      // Tests use ES module syntax and run through the `esm` loader (mocha --require esm).
      files: ['test/**/*.js'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off',
      },
    },
  ],
};
