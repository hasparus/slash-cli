module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "test-package"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
