/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { OpenAPIV3 } from 'openapi-types'


Handlebars.registerHelper('get-schema-by-ref', (schema: OpenAPIV3.ReferenceObject, options: Handlebars.HelperOptions) => {
  const ref = schema
  const api = options.data.root.api

  let value

  for (const key of ref.$ref.split('/')) {
    if (key === '#') {
      value = api
    } else {
      value = value[key]
    }

    if (!value) break
  }

  return value
})
