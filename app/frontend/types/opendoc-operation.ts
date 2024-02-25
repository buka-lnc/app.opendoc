import { OpenAPIV3 } from "openapi-types"

export interface OpendocOperation {
  /**
   * @example "#/api/v1/users/{userId}/get"
   */
  id: string

  /**
   * @example "/api/v1/users/{userId}"
   */
  pathname: string

  /**
   * @example "get"
   */
  method: string

  title: string

  value: OpenAPIV3.OperationObject
}
