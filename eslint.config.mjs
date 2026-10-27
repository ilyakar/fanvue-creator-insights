/* ------------------------------------------------------------
Applies OneRent's shared ESLint rules to Creator Insights.
---------------------------------------------------------------*/

import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'good-code-from-another-project/**',
      'next-env.d.ts'
    ]
  },
  { files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'] },
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: { import: importPlugin },
    rules: {
      'import/no-relative-parent-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'ignore' },
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin']
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-newline': ['warn', { prevent: true, allowMultilines: true }]
    },
    settings: { react: { version: 'detect' } }
  }
]
