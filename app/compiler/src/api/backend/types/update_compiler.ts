import type { KeqOperation } from 'keq'
import type { Compiler } from "../components/schemas/compiler"
import type { UpdateCompilerDTO } from "../components/schemas/update_compiler_dto"


export interface ResponseMap {
  "200": Compiler
}


export type QueryParameters = {
}

export type RouteParameters = {
  "compilerId": string
}

export type HeaderParameters = {
}

export type BodyParameters =(UpdateCompilerDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
