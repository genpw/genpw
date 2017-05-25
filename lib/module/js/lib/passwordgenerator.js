var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { random } from 'sjcl';
import { diceware8k } from './diceware8k';

var privatePrng = new WeakMap();
var privateSymbolTable = new WeakMap();

export var PasswordGeneratorException = function () {
  function PasswordGeneratorException(message) {
    _classCallCheck(this, PasswordGeneratorException);

    this.message = message;
  }

  _createClass(PasswordGeneratorException, [{
    key: 'toString',
    value: function toString() {
      return this.message;
    }
  }]);

  return PasswordGeneratorException;
}();

export var PasswordGenerator = function () {
  /**
   * The Constructor
   * @param {settings} string
   */
  function PasswordGenerator() {
    var symbolTable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : diceware8k;
    var prng = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : random;

    _classCallCheck(this, PasswordGenerator);

    this.symbolTable = symbolTable;
    this.prng = prng;
  }

  /**
   * Generate a Password
   */


  _createClass(PasswordGenerator, [{
    key: 'generate',
    value: function generate(numSymbols) {
      var out = [];
      for (var i = 0; i < (numSymbols || 1); i += 1) {
        out.push(this.symbol);
      }
      return out.join(' ');
    }

    /**
     * Get one random symbol from the symbol table
     */

  }, {
    key: 'symbol',
    get: function get() {
      return this.symbolTable[this.randomBits];
    }
  }, {
    key: 'symbolTable',
    set: function set(newSymbolTable) {
      if (!Array.isArray(newSymbolTable)) {
        throw new PasswordGeneratorException('Symbol table must be an array.');
      }

      var listLength = newSymbolTable.length;

      if (listLength < PasswordGenerator.minList) {
        privateSymbolTable.set(this, [0, 1]);
        return;
      }
      if (listLength > PasswordGenerator.maxList) {
        privateSymbolTable.set(this, newSymbolTable.slice(0, PasswordGenerator.maxList));
        return;
      }
      if ((listLength & listLength - 1) !== 0) {
        // eslint-disable-line no-bitwise
        var nextLowestPower = PasswordGenerator.nextLowestPower(listLength);
        privateSymbolTable.set(this, newSymbolTable.slice(0, nextLowestPower));
        return;
      }
      privateSymbolTable.set(this, newSymbolTable);
    },
    get: function get() {
      return privateSymbolTable.get(this);
    }
  }, {
    key: 'prng',
    set: function set(newPrng) {
      privatePrng.set(this, newPrng);
    }
  }, {
    key: 'randomBits',
    get: function get() {
      var prng = privatePrng.get(this);
      return (prng.randomWords(1) & this.bitMask) >>> 0; // eslint-disable-line no-bitwise
    }

    /**
     * The last index of the symbol table as an unsigned int
     */

  }, {
    key: 'bitMask',
    get: function get() {
      return this.symbolTable.length - 1 >>> 0; // eslint-disable-line no-bitwise
    }
  }], [{
    key: 'nextLowestPower',


    /**
     * gets the next lowest number that
     * is a power of two
     */
    value: function nextLowestPower(y) {
      var x = y;
      x = (x | x >>> 1) >>> 0; // eslint-disable-line no-bitwise
      x = (x | x >>> 2) >>> 0; // eslint-disable-line no-bitwise
      x = (x | x >>> 4) >>> 0; // eslint-disable-line no-bitwise
      x = (x | x >>> 8) >>> 0; // eslint-disable-line no-bitwise
      x = (x | x >>> 16) >>> 0; // eslint-disable-line no-bitwise
      x = x - (x >>> 1) >>> 0; // eslint-disable-line no-bitwise
      return x;
    }
  }, {
    key: 'minList',
    get: function get() {
      return 0x2;
    }

    /**
     * Currently Limit to 16 bits or 65,536 symbols.
     * Could possibly support up to 32 bits (0xFFFFFFFF + 0x1;)
     * the current max size of a javascript array.
     */

  }, {
    key: 'maxList',
    get: function get() {
      return 0xFFFF + 0x1;
    }
  }]);

  return PasswordGenerator;
}();