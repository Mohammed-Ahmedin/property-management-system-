import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore generated & build files
  globalIgnores(['dist', 'node_modules', 'build']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        React: 'readonly', // prevent 'React not defined' errors
      },
    },
    rules: {
      // ✅ Relax overly strict TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // ✅ React rules that are no longer needed or too strict
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // ✅ General JS relaxations
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // ✅ Optional — helps during dev but warns on console logs
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])
