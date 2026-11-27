import { PasswordGenerator } from './password-generator.js';

/** @typedef {import('./password-generator.js').RandomSource} RandomSource */

export { diceware8k } from './diceware8k.js';
export { PasswordGenerator };
export default PasswordGenerator;

// Makes `require('genpw')` return the class itself, as it did in genpw 2.x.
export { PasswordGenerator as 'module.exports' };
