import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1) Ignore generated stuff so ESLint doesn't scan build output
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/coverage/**",
    ],
  },

  // 2) Next.js presets (compat converts eslintrc-style presets)
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
