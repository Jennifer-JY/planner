import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  collectCoverage: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleNameMapper: {
    "/prisma$": "<rootDir>/tests/__mocks__/prisma.ts",
    "^@/(.*)$": "<rootDir>/$1",
    "/auth$": "<rootDir>/tests/__mocks__/auth.ts",
    "^next/link$": "<rootDir>/tests/__mocks__/next/link.tsx",
  },
  transformIgnorePatterns: ["/node_modules/(?!nanoid|next-auth|@auth/core)/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
