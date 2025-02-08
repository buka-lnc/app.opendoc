import { OpenAPIV3 } from 'openapi-types'

export interface ReferenceStorage<T> {
  paths?: {
    [pattern: string]: {
      [key in OpenAPIV3.HttpMethods]: T
    } | undefined
  }

  components?: {
    [key in keyof OpenAPIV3.ComponentsObject]: T
  }
}
