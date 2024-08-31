// @ts-check
import buka from '@buka/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(...buka.nuxt.recommended)
