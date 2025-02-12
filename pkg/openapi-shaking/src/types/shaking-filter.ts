import { OpenAPIV3 } from 'openapi-types'
import { Promisable } from 'type-fest'


export type ShakingFilter = (
  path: string,
  method: OpenAPIV3.HttpMethods,
  operation: OpenAPIV3.OperationObject
) => Promisable<boolean>


export type ShakingFilterSync = (
  path: string,
  method: OpenAPIV3.HttpMethods,
  operation: OpenAPIV3.OperationObject
) => boolean
