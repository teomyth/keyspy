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
    "!src/examples/**",
    "!native/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json"],
  coverageThreshold: {
    global: {
      branches: 14,
      functions: 23,
      lines: 35,
      statements: 34,
    },
  },
  setupFilesAfterEnv: [],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 30000,
  reporters: [
    "default",
    "jest-junit"
  ],
};
