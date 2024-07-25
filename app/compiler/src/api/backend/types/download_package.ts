import type { KeqOperation } from 'keq'


export interface ResponseMap {
  "200": unknown
  "400": {
  "statusCode": number
  "message": string
  "error"?: string
}
}


export type QueryParameters = {
}

export type RouteParameters = {
  "packageName": string
  "packageTag": string
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
