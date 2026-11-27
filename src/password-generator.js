import { diceware8k } from './diceware8k.js';

/** Number of distinct values a Uint32 can hold. */
const UINT32_RANGE = 2 ** 32;

/**
 * A source of cryptographically secure random values, such as the Web Crypto
 * `crypto` object available in Node.js and browsers.
 *
 * @typedef {object} RandomSource
 * @property {(array: Uint32Array<ArrayBuffer>) => Uint32Array<ArrayBuffer>} getRandomValues
 *   Fills the array with random values and returns it.
 */

/**
 * Generates passphrases by picking symbols (usually words) uniformly at random
 * from a symbol table.
 */
export class PasswordGenerator {
  /** @type {readonly string[]} */
  #symbolTable = [];

  /** @type {RandomSource} */
  #random;

  /**
   * Random values at or above this limit are rejected so that every symbol is
   * equally likely (no modulo bias).
   *
   * @type {number}
   */
  #limit = UINT32_RANGE;

  /** @type {Uint32Array<ArrayBuffer>} */
  #buffer = new Uint32Array(1);

  /**
   * @param {readonly string[]} [symbolTable] - Distinct symbols to build
   *   passphrases from. Defaults to the Diceware 8k word list. Any length of 2
   *   or more is supported.
   * @param {RandomSource} [random] - Source of randomness. Defaults to
   *   `globalThis.crypto`.
   */
  constructor(symbolTable = diceware8k, random = globalThis.crypto) {
    if (!random || typeof random.getRandomValues !== 'function') {
      throw new TypeError('Random source must provide getRandomValues().');
    }
    this.#random = random;
    this.symbolTable = symbolTable;
  }

  /**
   * The symbols passphrases are built from. Setting it stores a frozen copy, so
   * later changes to the original array have no effect.
   *
   * @type {readonly string[]}
   */
  get symbolTable() {
    return this.#symbolTable;
  }

  set symbolTable(symbolTable) {
    if (!Array.isArray(symbolTable)) {
      throw new TypeError('Symbol table must be an array.');
    }
    if (symbolTable.length < 2) {
      throw new RangeError('Symbol table must contain at least 2 symbols.');
    }
    this.#symbolTable = Object.isFrozen(symbolTable)
      ? symbolTable
      : Object.freeze([...symbolTable]);
    this.#limit = UINT32_RANGE - (UINT32_RANGE % symbolTable.length);
  }

  /**
   * Bits of entropy each symbol adds to a passphrase.
   *
   * @type {number}
   */
  get bitsPerSymbol() {
    return Math.log2(this.#symbolTable.length);
  }

  /**
   * One symbol picked uniformly at random from the symbol table.
   *
   * @type {string}
   */
  get symbol() {
    return this.#symbolTable[this.#randomIndex()];
  }

  /**
   * Generate a passphrase.
   *
   * @param {number} [count] - Number of symbols in the passphrase.
   * @returns {string} The symbols, separated by single spaces. An empty string
   *   when `count` is 0.
   */
  generate(count = 1) {
    if (!Number.isSafeInteger(count)) {
      throw new TypeError('Symbol count must be an integer.');
    }
    if (count < 0) {
      throw new RangeError('Symbol count must not be negative.');
    }
    return Array.from({ length: count }, () => this.symbol).join(' ');
  }

  /**
   * A uniformly distributed index into the symbol table, using rejection
   * sampling over 32-bit random values.
   *
   * @returns {number}
   */
  #randomIndex() {
    let value;
    do {
      this.#random.getRandomValues(this.#buffer);
      [value] = this.#buffer;
    } while (value >= this.#limit);
    return value % this.#symbolTable.length;
  }
}
