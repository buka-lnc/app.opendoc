import type { KeqOperation } from 'keq'


export interface ResponseMap {
  "201": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
  "pluginId": string
}

export type HeaderParameters = {
}

export type BodyParameters =(string)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
