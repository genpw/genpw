import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { diceware8k } from '../src/diceware8k.js';

const bin = fileURLToPath(new URL('../bin/genpw.js', import.meta.url));

/** @param {string[]} args */
function genpw(...args) {
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [bin, ...args],
    {
      encoding: 'utf8',
    },
  );
  return { status, stdout, stderr };
}

/** @param {string} stdout */
function words(stdout) {
  const line = stdout.replace(/\n$/, '');
  return line === '' ? [] : line.split(' ');
}

describe('genpw CLI', () => {
  it('prints 7 words by default', () => {
    const { status, stdout, stderr } = genpw();
    assert.equal(status, 0);
    assert.equal(stderr, '');
    const result = words(stdout);
    assert.equal(result.length, 7);
    for (const word of result) {
      assert.ok(diceware8k.includes(word), `${word} is not in the list`);
    }
  });

  for (const count of ['0', '1', '12']) {
    it(`prints ${count} words when asked`, () => {
      const { status, stdout } = genpw(count);
      assert.equal(status, 0);
      assert.equal(words(stdout).length, Number(count));
    });
  }

  for (const flag of ['--help', '-h']) {
    it(`shows usage with ${flag}`, () => {
      const { status, stdout } = genpw(flag);
      assert.equal(status, 0);
      assert.match(stdout, /^Usage: genpw \[count\]/);
    });
  }

  for (const flag of ['--version', '-v']) {
    it(`shows the version with ${flag}`, () => {
      const { version } = JSON.parse(
        readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
      );
      const { status, stdout } = genpw(flag);
      assert.equal(status, 0);
      assert.equal(stdout, `${version}\n`);
    });
  }

  const usageErrors = [
    [['abc'], /invalid word count 'abc'/],
    [['1.5'], /invalid word count '1.5'/],
    [['99999999999999999999'], /invalid word count/],
    [['-1'], /Unknown option '-1'/],
    [['--nope'], /Unknown option '--nope'/],
    [['1', '2'], /expected at most one argument/],
  ];
  for (const [args, message] of usageErrors) {
    it(`rejects ${JSON.stringify(args)}`, () => {
      const { status, stdout, stderr } = genpw(
        .../** @type {string[]} */ (args),
      );
      assert.equal(status, 2);
      assert.equal(stdout, '');
      assert.match(stderr, /** @type {RegExp} */ (message));
      assert.match(stderr, /Run 'genpw --help' for usage\./);
    });
  }
});
