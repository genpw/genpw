/**
 * This file acts as a CJS bridge to the password geneartor library.
 */
const esmRequire = require('esm')(module);

module.exports = esmRequire('./lib/passwordgenerator').default;
