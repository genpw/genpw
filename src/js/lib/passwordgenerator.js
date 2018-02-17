import { random } from 'sjcl';
import { diceware8k } from './diceware8k';

const privatePrng = new WeakMap();
const privateSymbolTable = new WeakMap();

class PasswordGenerator {
  /**
   * The Constructor
   * @param {array} symbolTable - list of distinct symbols used to build the password
   * @param {function} prng - a random number generator
   */
  constructor(symbolTable = diceware8k, prng = random) {
    this.symbolTable = symbolTable;
    this.prng = prng;
  }

  /**
   * Generate a Password
   * @param {int} numSymbols - the number of symbols you want to use in your password
   * @returns {string} - the generated password
   */
  generate(numSymbols) {
    const out = [];
    for (let i = 0; i < (numSymbols || 1); i += 1) {
      out.push(this.symbol);
    }
    return out.join(' ');
  }

  /**
   * Get one random symbol from the symbol table
   */
  get symbol() {
    return this.symbolTable[this.randomBits];
  }

  set symbolTable(newSymbolTable) {
    if (!Array.isArray(newSymbolTable)) {
      throw new TypeError('Symbol table must be an array.');
    }

    const listLength = newSymbolTable.length;

    if (listLength < PasswordGenerator.minList) {
      privateSymbolTable.set(this, [0, 1]);
      return;
    }
    if (listLength > PasswordGenerator.maxList) {
      privateSymbolTable.set(
        this,
        newSymbolTable.slice(0, PasswordGenerator.maxList)
      );
      return;
    }
    // eslint-disable-next-line no-bitwise
    if ((listLength & (listLength - 1)) !== 0) {
      const nextLowestPower = PasswordGenerator.nextLowestPower(listLength);
      privateSymbolTable.set(this, newSymbolTable.slice(0, nextLowestPower));
      return;
    }
    privateSymbolTable.set(this, newSymbolTable);
  }

  get symbolTable() {
    return privateSymbolTable.get(this);
  }

  set prng(newPrng) {
    privatePrng.set(this, newPrng);
  }

  get randomBits() {
    const prng = privatePrng.get(this);
    return (prng.randomWords(1) & this.bitMask) >>> 0; // eslint-disable-line no-bitwise
  }

  /**
   * The last index of the symbol table as an unsigned int
   */
  get bitMask() {
    return (this.symbolTable.length - 1) >>> 0; // eslint-disable-line no-bitwise
  }

  static get minList() {
    return 0x2;
  }

  /**
   * Currently Limit to 16 bits or 65,536 symbols.
   * Could possibly support up to 32 bits (0xFFFFFFFF + 0x1;)
   * the current max size of a javascript array.
   */
  static get maxList() {
    return 0xffff + 0x1;
  }

  /**
   * gets the next lowest number that
   * is a power of two
   * @param {int} y - the number
   * @returns {int} - the next lower power of two
   */
  static nextLowestPower(y) {
    let x = y;
    x = (x | (x >>> 1)) >>> 0; // eslint-disable-line no-bitwise
    x = (x | (x >>> 2)) >>> 0; // eslint-disable-line no-bitwise
    x = (x | (x >>> 4)) >>> 0; // eslint-disable-line no-bitwise
    x = (x | (x >>> 8)) >>> 0; // eslint-disable-line no-bitwise
    x = (x | (x >>> 16)) >>> 0; // eslint-disable-line no-bitwise
    x = (x - (x >>> 1)) >>> 0; // eslint-disable-line no-bitwise
    return x;
  }
}

export { PasswordGenerator as default };
