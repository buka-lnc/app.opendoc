import type { KeqOperation } from 'keq'
import type { ResponseOfQueryPluginsDTO } from "../components/schemas/response_of_query_plugins_dto"


export interface ResponseMap {
  "200": ResponseOfQueryPluginsDTO
}


export type QueryParameters = {
  "limit"?: string
  "offset"?: string
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters ={}
export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
