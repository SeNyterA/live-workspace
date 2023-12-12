module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],

  rules: {
    'react-refresh/only-export-components': [
      'off',
      {
        allowConstantExport: true,
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'avoid',
        semi: false,
        trailingComma: 'none',
        endOfLine: 'auto',
        jsxSingleQuote: true,
        useTabs: false,
        singleQuote: true
      }
    ]
  }
}
