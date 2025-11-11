module.exports = {
  extends: ['@eslint/js', '@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};