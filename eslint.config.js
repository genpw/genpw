import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import n from 'eslint-plugin-n';
import globals from 'globals';

export default [
  { ignores: ['coverage/', 'release/', 'types/'] },
  js.configs.recommended,
  n.configs['flat/recommended-module'],
  {
    languageOptions: { globals: globals.node },
    rules: {
      'n/hashbang': 'off', // bin/genpw.js keeps its shebang; npm links it as the genpw command.
    },
  },
  prettier,
];
