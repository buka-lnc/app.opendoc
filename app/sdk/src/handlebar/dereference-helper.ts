/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { OpenAPIV3 } from 'openapi-types'


Handlebars.registerHelper('h__dereference', (schema: OpenAPIV3.ReferenceObject, options: Handlebars.HelperOptions) => {
  const ref = schema
  const document = options.data.root.document

  let value

  for (const key of ref.$ref.split('/')) {
    if (key === '#') {
      value = document
    } else {
      value = value[key]
    }

    if (!value) break
  }

  return value
})
