import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
  }),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@stylistic/jsx-one-expression-per-line": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
