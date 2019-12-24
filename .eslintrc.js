module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "es6": true,
    "node" : true,
    "mocha": true
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "quotes": ["error", "single"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "never"],
    "eqeqeq": ["error", "always"],
    "brace-style": ["error", "1tbs"],
    "eol-last": ["error", "always"],
    "space-before-blocks": ["error", { "functions": "always", "keywords": "always", "classes": "always" }],
    "prefer-const": ["error"],
    "space-infix-ops": ["error"],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "keyword-spacing": ["error"],
    "key-spacing": ["error", { "beforeColon": false }]
  }
}
