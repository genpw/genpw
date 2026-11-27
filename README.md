# `genpw` Password Generator

[![CI](https://github.com/genpw/genpw/actions/workflows/ci.yml/badge.svg)](https://github.com/genpw/genpw/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/genpw.svg)](https://www.npmjs.com/package/genpw)

Generate random passphrases. By default, `genpw` picks words from the
[Diceware](http://world.std.com/~reinhold/diceware.html)
[8k word list](http://world.std.com/~reinhold/diceware8k.c), so each word adds
13 bits of entropy. Randomness comes from the Web Crypto API
(`crypto.getRandomValues`), and every word is equally likely.

## Command line

```console
$ npx genpw
belch pin shut debit boor jm packet

$ npx genpw 4
pug molten greedy twain
```

`genpw [count]` prints a passphrase of `count` words (default: 7). Run
`genpw --help` for all options.

## Library

Requires Node.js 26 or later, or any modern browser via a bundler.

```console
npm install genpw
```

```js
import PasswordGenerator from 'genpw';

const generator = new PasswordGenerator();
generator.generate(7); // 'iv weiss ...' (7 words, 91 bits of entropy)
```

CommonJS works too:

```js
const PasswordGenerator = require('genpw');
```

### `new PasswordGenerator(symbolTable?, random?)`

- `symbolTable`: the distinct symbols (usually words) to build passphrases
  from. Defaults to the Diceware 8k list. Any array of 2 or more symbols works.
  The generator keeps a frozen copy.
- `random`: an object with a `getRandomValues(Uint32Array)` method. Defaults to
  `globalThis.crypto`.

### Members

- `generate(count = 1)`: returns `count` random symbols separated by spaces, or
  `''` when `count` is 0.
- `symbol`: one random symbol.
- `symbolTable`: the symbols in use. You can also set a new table.
- `bitsPerSymbol`: entropy each symbol adds, `log2(symbolTable.length)`.

The package also exports the `diceware8k` word list and, for TypeScript, the
`RandomSource` type.

## Upgrading from 2.x

- ES module package for Node.js 26+. `require('genpw')` still returns the
  class.
- The `sjcl` dependency is gone. The second constructor argument is now a Web
  Crypto style source (`getRandomValues`) instead of an sjcl PRNG
  (`randomWords`).
- Symbol tables are no longer cut down to a power of two or to 65,536 entries.
  Every symbol you pass is used.
- Tables with fewer than 2 symbols throw a `RangeError` instead of silently
  becoming `[0, 1]`.
- `generate(0)` returns `''` instead of one word. Counts that are not
  non-negative integers throw.
- The internal helpers `randomBits`, `bitMask`, `minList`, `maxList` and
  `nextLowestPower` were removed.

## Contributing

[Suggestions for improvement](https://github.com/genpw/genpw/issues) are
welcome. Development needs Node.js 26 or later. `yarn test` runs the tests, `yarn lint` checks style, and
`yarn typecheck` checks the JSDoc types. Commits follow
[Conventional Commits](https://www.conventionalcommits.org/), which drive
releases.
