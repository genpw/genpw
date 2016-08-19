#!/usr/bin/env node
import { PasswordGenerator } from './passwordgenerator.js';

const pw = new PasswordGenerator();
console.log(pw.generate(7));
