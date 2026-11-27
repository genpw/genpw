export default {
  'package.json': ['sort-package-json', 'prettier --write'],
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml}': ['prettier --write'],
};
