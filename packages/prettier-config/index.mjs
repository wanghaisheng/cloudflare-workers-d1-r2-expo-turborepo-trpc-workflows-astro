/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "../../tooling/tailwind/index.ts",
};

export default config; 