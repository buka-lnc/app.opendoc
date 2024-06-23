import type { KeqOperation } from 'keq'
import type { ApiFile } from "../components/schemas/api_file"


export interface ResponseMap {
  "200": ApiFile
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
    "sheetId": string
    "version": string
    "path": string
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
