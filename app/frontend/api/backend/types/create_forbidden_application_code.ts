import type { KeqOperation } from 'keq'
import type { CreateForbiddenApplicationCodeDTO } from "../components/schemas/create_forbidden_application_code_dto"


export interface ResponseMap {
  "201": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters =(CreateForbiddenApplicationCodeDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
