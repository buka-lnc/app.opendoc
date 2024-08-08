import type { KeqOperation } from 'keq'
import type { Plugin } from "../components/schemas/plugin"
import type { UpdatePluginDTO } from "../components/schemas/update_plugin_dto"


export interface ResponseMap {
  "200": Plugin
}


export type QueryParameters = {
}

export type RouteParameters = {
  "compilerId": string
}

export type HeaderParameters = {
}

export type BodyParameters =(UpdatePluginDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
