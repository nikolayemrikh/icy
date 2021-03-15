module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: ["jest-extended"],
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  },
  globalSetup: "./jest-global-setup.js",
  testPathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/tmp"],
  testTimeout: 10000
};
