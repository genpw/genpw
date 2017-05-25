#!/usr/bin/env node
'use strict';

var _passwordgenerator = require('./passwordgenerator');

var pw = new _passwordgenerator.PasswordGenerator();
console.log(pw.generate(7)); // eslint-disable-line no-console