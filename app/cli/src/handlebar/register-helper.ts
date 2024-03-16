import './change-case-helper.js'
import './get-safe-operation-name-helper.js'
import './get-schema-by-ref-helper.js'
import './is-ref-helper.js'
import './json-path-helper.js'
import './newline-helper.js'
import './or-helper.js'
import './pick-ref-helper.js'
import './ref-name-helper.js'
import './regexp-helper.js'
import './stringify-helper.js'

import * as Handlebars from 'handlebars'
import * as HandlebarsRamdaHelpers from 'handlebars-ramda-helpers'

HandlebarsRamdaHelpers.register(Handlebars)
