import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import * as genpw from 'genpw';
import { PasswordGenerator } from '../src/password-generator.js';
import { diceware8k } from '../src/diceware8k.js';

describe('package exports', () => {
  it('exports the class as the default export', () => {
    assert.equal(genpw.default, PasswordGenerator);
  });

  it('exports named PasswordGenerator and diceware8k', () => {
    assert.equal(genpw.PasswordGenerator, PasswordGenerator);
    assert.equal(genpw.diceware8k, diceware8k);
  });

  it('returns the class from require(), like genpw 2.x', () => {
    const require = createRequire(import.meta.url);
    const Required = require('genpw');
    assert.equal(Required, PasswordGenerator);
    assert.equal(new Required().generate(2).split(' ').length, 2);
  });
});
