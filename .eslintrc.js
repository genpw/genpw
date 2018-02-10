const ERROR = 2;

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import'],
  rules: {
    complexity: [ERROR, 6],
  },
};
