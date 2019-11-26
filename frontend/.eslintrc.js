module.exports = {
  globals: {
    process: true
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:prettier/recommended"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "prettier/prettier": "warn",
  }
};
