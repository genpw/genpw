#!/usr/bin/env node
import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';
import { PasswordGenerator } from '../src/index.js';

const DEFAULT_COUNT = 7;

const USAGE = `Usage: genpw [count]

Generate a random passphrase.

Arguments:
  count          number of words (default: ${DEFAULT_COUNT})

Options:
  -h, --help     show this help
  -v, --version  show the version number`;

/**
 * @param {string[]} positionals
 * @returns {number} The requested word count.
 * @throws {Error} When the arguments are not a valid word count.
 */
function wordCount(positionals) {
  if (positionals.length > 1) {
    throw new Error('expected at most one argument');
  }
  if (positionals.length === 0) {
    return DEFAULT_COUNT;
  }
  const [arg] = positionals;
  if (!/^\d+$/.test(arg) || !Number.isSafeInteger(Number(arg))) {
    throw new Error(`invalid word count '${arg}'`);
  }
  return Number(arg);
}

/**
 * @param {string[]} args - Command-line arguments, without the node and
 *   script paths.
 * @returns {'help' | 'version' | number} What was asked for: help, the
 *   version, or a passphrase with this many words.
 * @throws {Error} On invalid usage.
 */
function parseRequest(args) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });
  if (values.help) {
    return 'help';
  }
  if (values.version) {
    return 'version';
  }
  return wordCount(positionals);
}

/**
 * @param {string[]} args
 * @returns {number} The process exit code.
 */
function main(args) {
  let request;
  try {
    request = parseRequest(args);
  } catch (error) {
    const { message } = /** @type {Error} */ (error);
    console.error(`genpw: ${message}\nRun 'genpw --help' for usage.`);
    return 2;
  }

  if (request === 'help') {
    console.log(USAGE);
  } else if (request === 'version') {
    console.log(createRequire(import.meta.url)('../package.json').version);
  } else {
    console.log(new PasswordGenerator().generate(request));
  }
  return 0;
}

process.exitCode = main(process.argv.slice(2));
