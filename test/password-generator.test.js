import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PasswordGenerator } from '../src/password-generator.js';
import { diceware8k } from '../src/diceware8k.js';

/**
 * A fake random source that returns the given 32-bit values in order and
 * counts how many times it was called.
 *
 * @param {number[]} values
 */
function sequence(values) {
  const source = {
    calls: 0,
    /** @param {Uint32Array<ArrayBuffer>} array */
    getRandomValues(array) {
      const next = values.slice(source.calls, source.calls + array.length);
      if (next.length < array.length) {
        throw new Error('fake random source exhausted');
      }
      array.set(next);
      source.calls += array.length;
      return array;
    },
  };
  return source;
}

describe('PasswordGenerator', () => {
  describe('defaults', () => {
    it('uses the Diceware 8k word list', () => {
      const pw = new PasswordGenerator();
      assert.equal(pw.symbolTable, diceware8k);
      assert.equal(pw.symbolTable.length, 8192);
      assert.equal(pw.bitsPerSymbol, 13);
    });

    it('generates one word when no count is given', () => {
      const words = new PasswordGenerator().generate().split(' ');
      assert.equal(words.length, 1);
      assert.ok(diceware8k.includes(words[0]));
    });

    it('generates the requested number of words from the list', () => {
      const words = new PasswordGenerator().generate(7).split(' ');
      assert.equal(words.length, 7);
      for (const word of words) {
        assert.ok(diceware8k.includes(word), `${word} is not in the list`);
      }
    });

    it('returns an empty string for a count of 0', () => {
      assert.equal(new PasswordGenerator().generate(0), '');
    });

    it('returns a random symbol', () => {
      const pw = new PasswordGenerator();
      const seen = new Set(Array.from({ length: 20 }, () => pw.symbol));
      assert.ok(seen.size > 1);
    });
  });

  describe('generate()', () => {
    for (const count of [-1, -100]) {
      it(`rejects the negative count ${count}`, () => {
        assert.throws(() => new PasswordGenerator().generate(count), {
          name: 'RangeError',
          message: 'Symbol count must not be negative.',
        });
      });
    }

    for (const count of [1.5, NaN, Infinity, '3', null, 2 ** 53]) {
      it(`rejects the non-integer count ${String(count)}`, () => {
        assert.throws(
          // @ts-expect-error: testing invalid input
          () => new PasswordGenerator().generate(count),
          { name: 'TypeError', message: 'Symbol count must be an integer.' },
        );
      });
    }
  });

  describe('symbol table', () => {
    it('must be an array', () => {
      assert.throws(
        // @ts-expect-error: testing invalid input
        () => new PasswordGenerator('value'),
        { name: 'TypeError', message: 'Symbol table must be an array.' },
      );
    });

    for (const table of [[], ['only']]) {
      it(`must have at least 2 symbols (got ${table.length})`, () => {
        assert.throws(() => new PasswordGenerator(table), {
          name: 'RangeError',
          message: 'Symbol table must contain at least 2 symbols.',
        });
      });
    }

    it('keeps every symbol when the length is not a power of two', () => {
      const table = ['a', 'b', 'c'];
      const pw = new PasswordGenerator(table, sequence([0, 1, 2, 3, 4, 5]));
      assert.deepEqual(pw.symbolTable, table);
      assert.equal(pw.generate(6), 'a b c a b c');
    });

    it('keeps every symbol of a long list', () => {
      const table = Array.from({ length: 0xffff + 0x2 }, (_, i) => `w${i}`);
      const pw = new PasswordGenerator(table, sequence([0xffff + 0x1]));
      assert.equal(pw.symbolTable.length, 0xffff + 0x2);
      assert.equal(pw.symbol, `w${0xffff + 0x1}`);
    });

    it('stores a frozen copy of the table', () => {
      const table = ['a', 'b'];
      const pw = new PasswordGenerator(table);
      table.push('c');
      assert.deepEqual(pw.symbolTable, ['a', 'b']);
      assert.ok(Object.isFrozen(pw.symbolTable));
    });

    it('can be replaced', () => {
      const pw = new PasswordGenerator(diceware8k, sequence([5]));
      pw.symbolTable = ['x', 'y', 'z'];
      assert.equal(pw.bitsPerSymbol, Math.log2(3));
      assert.equal(pw.symbol, 'z');
    });
  });

  describe('randomness', () => {
    it('requires a source with getRandomValues()', () => {
      assert.throws(
        // @ts-expect-error: testing invalid input
        () => new PasswordGenerator(diceware8k, {}),
        {
          name: 'TypeError',
          message: 'Random source must provide getRandomValues().',
        },
      );
    });

    it('rejects values that would bias the result', () => {
      // 2^32 % 3 === 1, so only 0xffffffff must be rejected for 3 symbols.
      const source = sequence([0xffffffff, 0xfffffffe]);
      const pw = new PasswordGenerator(['a', 'b', 'c'], source);
      assert.equal(pw.symbol, ['a', 'b', 'c'][0xfffffffe % 3]);
      assert.equal(source.calls, 2);
    });

    it('never rejects values for a power-of-two table', () => {
      const source = sequence([0xffffffff]);
      const pw = new PasswordGenerator(['a', 'b', 'c', 'd'], source);
      assert.equal(pw.symbol, 'd');
      assert.equal(source.calls, 1);
    });

    it('picks every symbol about equally often', () => {
      const table = ['a', 'b', 'c', 'd', 'e'];
      const pw = new PasswordGenerator(table);
      const draws = 50_000;
      /** @type {Map<string, number>} */
      const counts = new Map();
      for (let i = 0; i < draws; i += 1) {
        const { symbol } = pw;
        counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
      }
      assert.deepEqual([...counts.keys()].sort(), table);
      // Expected 10,000 each with a standard deviation of about 89; allow 5%.
      for (const [symbol, count] of counts) {
        assert.ok(
          Math.abs(count - draws / table.length) < 500,
          `${symbol} was picked ${count} times`,
        );
      }
    });
  });
});
