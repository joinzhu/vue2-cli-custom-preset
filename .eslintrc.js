module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    'prettier/prettier': 0,
    'vue/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'space-before-function-paren': 0,
    'no-control-regex': 0,
    'vue/no-unused-components': 1
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
