import { OpenAPIV3 } from 'openapi-types'

export interface OpendocSchema {
  /**
   * @example md5("#/components/schemas/OpendocSchema")
   */
  id: string

  /**
   * @example "#/components/schemas/OpendocSchema"
   */
  $id: string

  /**
   * @example "OpendocSchema"
   */
  title: string

  value: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}
