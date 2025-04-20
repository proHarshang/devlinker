import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginUnused from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', 'build', 'node_modules'],
  },
  {
    files: ['apps/client/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './apps/client/tsconfig.app.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
      'unused-imports': pluginUnused,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    files: ['apps/server/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './apps/server/tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
      'unused-imports': pluginUnused,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  prettier,
];
