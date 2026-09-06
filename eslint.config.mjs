import nextPlugin from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  ...nextPlugin,
  prettierConfig,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
