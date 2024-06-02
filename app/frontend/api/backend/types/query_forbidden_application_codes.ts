import type { KeqOperation } from 'keq'
import type { ForbiddenApplicationCode } from "../components/schemas/forbidden_application_code.js"


export interface ResponseMap {
  "200": (ForbiddenApplicationCode)[]
}


export type QueryParameters = {
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
