import { OpenAPIV3 } from 'openapi-types'

export interface OpendocSchema {
  /**
   * @example "#/components/schemas/OpendocSchema"
   */
  id: string

  /**
   * @example "OpendocSchema"
   */
  title: string

  value: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}
