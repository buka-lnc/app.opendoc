import type { KeqOperation } from 'keq'
import type { Plugin } from "../components/schemas/plugin"
import type { CreatePluginDTO } from "../components/schemas/create_plugin_dto"


export interface ResponseMap {
  "201": Plugin
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters =(CreatePluginDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
