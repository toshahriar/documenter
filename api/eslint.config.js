import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.husky/**',
      '*.config.js',
      '*.config.ts',
      'jest.config.js',
      '*.d.ts',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.test.json'],
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-expressions': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'quote-props': ['error', 'as-needed'],
      'no-nested-ternary': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-explicit-any': 'off',
      'explicit-function-return-type': 'off',
      'no-unsafe-function-type': 'off',
    },
  },
  prettierConfig,
];
