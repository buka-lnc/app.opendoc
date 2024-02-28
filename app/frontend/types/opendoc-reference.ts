import { OpenAPIV3 } from 'openapi-types'

export interface OpendocReference {
  /**
   * The path to the schema in the OpenAPI document
   * 查找到这个引用的路径
   */
  path: string[]

  /**
   * The schema object
   * 引用指向的 schema 对象
   */
  schema: OpenAPIV3.SchemaObject | undefined
}
