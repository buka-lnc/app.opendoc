module.exports = {
  root: true,
  extends: [
    '@vue/eslint-config-typescript',
    '@buka/eslint-config/typescript/recommended',
    '@nuxtjs/eslint-config-typescript',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    project: ['./**/tsconfig.json', './**/tsconfig.**.json'],
  },
  ignorePatterns: ['api/**'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'vue/multi-word-component-names': 'off',
    curly: ['error', 'multi-line', 'consistent'],
  },
}
