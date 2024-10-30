/** @type {import('eslint').FlatConfig} */
const parser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

const config = [
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
      },
    },
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
        semi: ['error', 'never'],
    },
  },
];

module.exports = config;
