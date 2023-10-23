module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    browser: true,
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      env: {
        node: true,
        es2022: true,
      },
      files: ["**/src/**/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": [
          "error",
          {
            fixToUnknown: true,
          }
        ]
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
  },
};

