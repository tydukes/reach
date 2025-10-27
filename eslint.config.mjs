import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Global ignores
  {
    ignores: ['**/dist/', '**/node_modules/', '**/*.js'],
  },

  // Main configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        node: true,
        es2022: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Disable explicit return types (allows inference)
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Warn on explicit any (not an error)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Enforce no unused vars with underscore prefix exceptions
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Warn on console usage except warn/error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);
