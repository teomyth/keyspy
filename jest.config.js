const os = require("node:os");

const platform = os.platform();
const platformDir = platform === "darwin" ? "macos" : platform === "win32" ? "windows" : "linux";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/*.(test|spec).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: false }],
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/bin/**",
    "!src/examples/**",
    "!src/ts/_tests/**",
  ],
  coverageDirectory: `test-reports/${platformDir}/coverage`,
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: [],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 30000,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: `test-reports/${platformDir}`,
        outputName: "junit.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        usePathForSuiteName: true,
      },
    ],
  ],
};
