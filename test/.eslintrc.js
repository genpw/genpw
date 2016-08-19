module.exports = {
  "rules": {
    // tests can import things in devDependencies
    "import/no-extraneous-dependencies": [2, {"devDependencies": true}]
  },
  "env": {
      "mocha": true
  }
}
