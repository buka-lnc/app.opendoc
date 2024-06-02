import type { KeqOperation } from 'keq'
import type { Application } from "../components/schemas/application.js"


export interface ResponseMap {
  "200": Application
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
    "applicationIdOrCode": string
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
