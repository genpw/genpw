module.exports = {
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: [
    'no-unsafe-innerhtml',
    'optimize-regex',
    'scanjs-rules',
    'security'
  ],
  rules: {
    // Security rules
    'no-unsafe-innerhtml/no-unsafe-innerhtml': 2,
    'security/detect-object-injection': 0,
    'security/detect-non-literal-regexp': 0,
    'security/detect-unsafe-regex': 0,
    'security/detect-buffer-noassert': 1,
    'security/detect-child-process': 1,
    'security/detect-disable-mustache-escape': 1,
    'security/detect-eval-with-expression': 1,
    'security/detect-no-csrf-before-method-override': 1,
    'security/detect-non-literal-fs-filename': 1,
    'security/detect-non-literal-require': 0,
    'security/detect-possible-timing-attacks': 1,
    'security/detect-pseudoRandomBytes': 1,
    
    // Optimize regex
    'optimize-regex/optimize-regex': 1
  }
};
