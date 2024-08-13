import type { KeqOperation } from 'keq'
import type { Plugin } from "../components/schemas/plugin"


export interface ResponseMap {
  "200": Plugin
}


export type QueryParameters = {
}

export type RouteParameters = {
  "pluginId": string
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
