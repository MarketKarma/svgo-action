module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],

  ignorePatterns: [
    "node_modules/", // dependencies directory
    "lib/", // TypeScript generated files
  ],

  globals: {
    "jest": "readonly",
  },
  rules: {
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
    }],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "_+" }],
  },
  overrides: [
    {
      // Configuration files
      files: ["*.js"],
      globals: {
        "module": "readonly",
      },
    },
  ],
};
