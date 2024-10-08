import type { KeqOperation } from 'keq'
import type { ResponseOfQueryApplicationsDTO } from "../components/schemas/response_of_query_applications_dto"


export interface ResponseMap {
  "200": ResponseOfQueryApplicationsDTO
  "500": unknown
}


export type QueryParameters = {
  "title"?: string
  "code"?: string
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
