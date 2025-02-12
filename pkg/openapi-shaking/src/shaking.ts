import * as R from 'ramda'
import { OpenAPIV3 } from 'openapi-types'
import { ShakingFilter } from './types/shaking-filter'
import { isValidMethod } from './utils/is-valid-method'
import { openapiShakingOrphanedComponents } from './shaking-orphaned-components'


export function openapiShaking(document: Readonly<OpenAPIV3.Document>, filter: ShakingFilter): OpenAPIV3.Document {
  let doc = document

  for (const path in document.paths) {
    for (const method in document.paths[path]) {
      if (!isValidMethod(method)) continue

      const operation = R.path(['paths', path, method], document) as (OpenAPIV3.OperationObject | undefined)
      if (!operation) continue

      if (!filter(path, method, operation)) {
        doc = R.dissocPath(['paths', path, method], doc)
      }
    }

    if (R.isEmpty(R.path(['paths', path], doc))) {
      doc = R.dissocPath(['paths', path], doc)
    }
  }

  return openapiShakingOrphanedComponents(doc)
}
