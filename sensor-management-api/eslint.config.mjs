import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    extends: ['js/recommended'],
    rules: {
      'prettier/prettier': 'warn', // Enforce .prettierrc
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    rules: {
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
  {
    plugins: { unicorn },
    rules: {
      'unicorn/no-empty-file': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    },
  },
  configPrettier, // Add as last step to disable conflicting rules
]);
