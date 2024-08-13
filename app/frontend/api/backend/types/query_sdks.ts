import type { KeqOperation } from 'keq'
import type { ResponseOfQuerySdksDTO } from "../components/schemas/response_of_query_sdks_dto"


export interface ResponseMap {
  "200": ResponseOfQuerySdksDTO
  "500": unknown
}


export type QueryParameters = {
  "sheetId"?: string
  "version"?: string
  "limit"?: number
  "offset"?: number
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
