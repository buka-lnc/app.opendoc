import { OpenAPIV3 } from 'openapi-types'


export function isValidMethod(method: unknown): method is OpenAPIV3.HttpMethods {
  if (typeof method !== 'string') return false
  return Object.values(OpenAPIV3.HttpMethods).some((m) => m === method)
}
