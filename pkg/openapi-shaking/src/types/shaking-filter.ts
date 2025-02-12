import { OpenAPIV3 } from 'openapi-types'


export type ShakingFilter = (
  path: string,
  method: OpenAPIV3.HttpMethods,
  operation: OpenAPIV3.OperationObject
) => boolean
