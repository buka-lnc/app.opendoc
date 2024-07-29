import type { KeqOperation } from 'keq'
import type { Compiler } from "../components/schemas/compiler"
import type { CreateCompilerDTO } from "../components/schemas/create_compiler_dto"


export interface ResponseMap {
  "201": Compiler
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters =(CreateCompilerDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
