#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { PasswordGenerator } from '../src/index.js';

const DEFAULT_COUNT = 7;

const USAGE = `Usage: genpw [count]

Generate a random passphrase from the Diceware 8k word list.

Arguments:
  count          number of words (default: ${DEFAULT_COUNT})

Options:
  -h, --help     show this help
  -v, --version  show the version number`;

/**
 * @param {string} message
 * @returns {number} The exit code for a usage error.
 */
function usageError(message) {
  console.error(`genpw: ${message}\nRun 'genpw --help' for usage.`);
  return 2;
}

/**
 * @param {string[]} args - Command-line arguments, without the node and
 *   script paths.
 * @returns {number} The process exit code.
 */
function main(args) {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
      },
    });
  } catch (error) {
    return usageError(/** @type {Error} */ (error).message);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    console.log(USAGE);
    return 0;
  }

  if (values.version) {
    const pkg = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    );
    console.log(pkg.version);
    return 0;
  }

  if (positionals.length > 1) {
    return usageError('expected at most one argument');
  }

  let count = DEFAULT_COUNT;
  if (positionals.length === 1) {
    const [arg] = positionals;
    if (!/^\d+$/.test(arg) || !Number.isSafeInteger(Number(arg))) {
      return usageError(`invalid word count '${arg}'`);
    }
    count = Number(arg);
  }

  console.log(new PasswordGenerator().generate(count));
  return 0;
}

process.exitCode = main(process.argv.slice(2));
