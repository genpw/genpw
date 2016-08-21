import { random } from 'sjcl';
import { diceware8k } from './diceware8k';

const privatePrng = new WeakMap();
const privateSymbolTable = new WeakMap();

export class PasswordGeneratorException {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export class PasswordGenerator {
  /**
   * The Constructor
   * @param {settings} string
   */
  constructor(symbolTable = diceware8k, prng = random) {
    this.symbolTable = symbolTable;
    this.prng = prng;
  }

  /**
   * Generate a Password
   */
  generate(numSymbols) {
    const out = [];
    for (let i = 0; i < (numSymbols || 1); i++) {
      out.push(this.symbol);
    }
    return out.join();
  }

  /**
   * Get one random symbol from the symbol table
   */
  get symbol() {
    return this.symbolTable[this.randomBits];
  }

  set symbolTable(newSymbolTable) {
    if (!Array.isArray(newSymbolTable)) {
      throw new PasswordGeneratorException('Symbol table must be an array.');
    }

    const listLength = newSymbolTable.length;

    if (listLength < this.minList) {
      privateSymbolTable.set(this, [0, 1]);
      return;
    }
    if (listLength > this.maxList) {
      privateSymbolTable.set(this, newSymbolTable.slice(0, this.maxList));
      return;
    }
    if ((listLength & (listLength - 1)) !== 0) {
      privateSymbolTable.set(this, newSymbolTable.slice(0, this.nextLowestPower(listLength)));
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
    return (privatePrng.get(this).randomWords(1) & this.bitMask) >>> 0;
  }

  /**
   * The last index of the symbol table as an unsigned int
   */
  get bitMask() {
    return (this.symbolTable.length - 1) >>> 0;
  }

  get minList() {
    return 0x2;
  }

  /**
   * Currently Limit to 16 bits or 65,536 symbols.
   * Could possibly support up to 32 bits (0xFFFFFFFF + 0x1;)
   * the current max size of a javascript array.
   */
  get maxList() {
    return 0xFFFF + 0x1;
  }

  /**
   * gets the next lowest number that
   * is a power of two
   */
  nextLowestPower(y) {
    let x = y;
    x = (x | (x >>> 1)) >>> 0;
    x = (x | (x >>> 2)) >>> 0;
    x = (x | (x >>> 4)) >>> 0;
    x = (x | (x >>> 8)) >>> 0;
    x = (x | (x >>> 16)) >>> 0;
    x = (x - (x >>> 1)) >>> 0;
    return x;
  }
}
