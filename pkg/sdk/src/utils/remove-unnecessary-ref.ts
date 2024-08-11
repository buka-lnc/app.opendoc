import { OpenAPIV3 } from 'openapi-types'
import { dereference } from './dereference'


function normalize<T>(doc: OpenAPIV3.Document, maybeRef: T | OpenAPIV3.ReferenceObject): T {
  if (typeof maybeRef === 'object' && maybeRef && '$ref' in maybeRef && maybeRef.$ref) {
    return dereference(doc, maybeRef.$ref) as T
  }

  return maybeRef as T
}

/**
 * 解除 requestBody, response, header, parameter 的 $ref
 */
export function removeUnnecessaryRef(doc: OpenAPIV3.Document): void {
  for (const path in doc.paths) {
    if (!doc.paths[path]) continue

    const pathItem = normalize<OpenAPIV3.PathItemObject>(doc, doc.paths[path] as (OpenAPIV3.PathItemObject | OpenAPIV3.ReferenceObject))
    if (!pathItem) continue
    doc.paths[path] = pathItem

    for (const method in pathItem) {
      if (['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace'].indexOf(method.toLowerCase()) === -1) continue

      const operation: OpenAPIV3.OperationObject = pathItem[method]

      if (operation.requestBody) {
        const requestBody = normalize<OpenAPIV3.RequestBodyObject>(doc, operation.requestBody)
        operation.requestBody = requestBody
      }


      for (const code in operation.responses) {
        if (!operation.responses[code]) continue

        const response: OpenAPIV3.ResponseObject = normalize<OpenAPIV3.ResponseObject>(doc, operation.responses[code])
        operation.responses[code] = response

        for (const header in response.headers) {
          if (!response.headers[header]) continue

          const headerObject = normalize<OpenAPIV3.HeaderObject>(doc, response.headers[header])
          response.headers[header] = headerObject
        }
      }

      if (Array.isArray(operation.parameters)) {
        operation.parameters = operation.parameters.map((parameter) => normalize<OpenAPIV3.ParameterObject>(doc, parameter))
      }
    }
  }
}
