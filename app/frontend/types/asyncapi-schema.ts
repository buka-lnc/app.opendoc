import { OpenAPIV3 } from 'openapi-types'

export type AsyncapiSchema = OpenAPIV3.SchemaObject & {
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

  [key: string]: any
}
