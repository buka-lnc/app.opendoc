import { OpenAPIV3 } from 'openapi-types'

export interface OpenapiOperation extends OpenAPIV3.OperationObject {
  /**
   * @example md5("#/api/v1/users/{userId}/get")
   */
  $uid: string

  /**
   * @example "/api/v1/users/{userId}"
   */
  $pathname: string

  /**
   * @example "get"
   */
  $method: string
}
