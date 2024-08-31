const buka = require('@buka/eslint-config')


module.exports = [
  {
    ignores: ['src/api', 'dist', 'storage'],
  },
  ...buka.nestjs.recommended,
]
