import { OpenAPIV3 } from 'openapi-types'

export type OpenapiSchema = OpenAPIV3.SchemaObject & {
  /**
   * @example "#/components/schema/User"
   */
  $id: string

  /**
   * @example md5("#/components/schema/User")
   */
  $uid: string

  /**
   * @example "User"
   */
  $name: string
}
