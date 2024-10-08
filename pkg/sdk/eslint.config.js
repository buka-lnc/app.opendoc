const buka = require('@buka/eslint-config')
const globals = require('globals')


module.exports = [
  {
    ignores: ['src/api', 'dist', 'storage'],
  },
  ...buka.typescript.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
