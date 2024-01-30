require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['@buka/eslint-config/typescript/recommended'],
  parserOptions: {
    sourceType: 'module',
    project: true,
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['src/api/**', 'dist'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
