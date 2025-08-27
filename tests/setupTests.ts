import "@testing-library/jest-dom";

jest.mock("next-auth"); // will use tests/__mocks__/next-auth.ts
jest.mock("nanoid", () => ({ nanoid: jest.fn() }));
jest.mock("@/auth", () => require("./__mocks__/auth.ts"));
jest.mock("bcryptjs", () => ({ hash: jest.fn() }));
