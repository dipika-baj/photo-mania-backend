module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports", "simple-import-sort"],
  rules: {
    "unused-imports/no-unused-imports": ["error"],
    "simple-import-sort/imports": ["error"],
    "no-duplicate-imports": ["error"],
    "no-unused-vars": ["error", {
      "caughtErrors": "none"
    }],
    "no-console": "off",
  },
}
