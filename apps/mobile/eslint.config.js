const expo = require('eslint-config-expo/flat')
const prettier = require('eslint-config-prettier')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsparser = require('@typescript-eslint/parser')

module.exports = [
  ...expo,
  prettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsparser },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      // Known false positive: flags `i18n.use()` because i18next also exports `use`.
      'import/no-named-as-default-member': 'off',
      // Rule 9: no any.
      '@typescript-eslint/no-explicit-any': 'error',
      // Rule 2: a domain module is reached through its index.ts only.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domain/*/*'],
              message: 'Seam violation: import the module through its index.ts.',
            },
          ],
        },
      ],
    },
  },
  { ignores: ['dist/*', '.expo/*', 'node_modules/*'] },
]
