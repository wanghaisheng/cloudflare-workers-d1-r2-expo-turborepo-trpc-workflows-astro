import baseConfig from "@acme/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", "src/workflows/daily-recap.ts"],
  },
  ...baseConfig
];
