import type { KeqOperation } from 'keq'
import type { SheetVersion } from "../components/schemas/sheet_version.js"


export interface ResponseMap {
  "200": SheetVersion
}


export type QueryParameters = {
}

export type RouteParameters = {
    "sheetVersionId": string
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
