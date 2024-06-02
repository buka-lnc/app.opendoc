import type { KeqOperation } from 'keq'
import type { Application } from "../components/schemas/application.js"
import type { CreateApplicationDTO } from "../components/schemas/create_application_dto.js"


export interface ResponseMap {
  "201": Application
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters =(CreateApplicationDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
