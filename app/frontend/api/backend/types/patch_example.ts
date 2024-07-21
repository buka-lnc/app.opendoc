import type { KeqOperation } from 'keq'


export interface ResponseMap {
  "200": unknown
  "400": {
  "statusCode": number
  "message": string
  "error"?: string
}
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
  "id": string
}

export type HeaderParameters = {
  "Authorization": string
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
