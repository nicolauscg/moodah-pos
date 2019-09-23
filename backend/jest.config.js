module.exports = {
  verbose: true,
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};
