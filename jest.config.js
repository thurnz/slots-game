const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // Use jsdom so window/document exist (Pixi needs this)
  testEnvironment: "jsdom",

  // TypeScript transform
  transform: {
    ...tsJestTransformCfg,
  },

  // Tell Jest where to look for tests
  roots: ["<rootDir>/src"],

  // Allow mocking PixiJS easily
  moduleNameMapper: {
    "^pixi.js$": "<rootDir>/__mocks__/pixi.js",
    "^pixi-spine$": "<rootDir>/__mocks__/pixi-spine.js",
  },

  // Optional quality-of-life
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],

  // Optional setup file for global mocks or console silencing
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
