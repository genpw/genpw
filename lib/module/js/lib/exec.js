#!/usr/bin/env node

import { PasswordGenerator } from './passwordgenerator';

var pw = new PasswordGenerator();
console.log(pw.generate(7)); // eslint-disable-line no-console