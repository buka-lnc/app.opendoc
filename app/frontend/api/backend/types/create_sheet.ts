import type { KeqOperation } from 'keq'
import type { Sheet } from "../components/schemas/sheet.js"
import type { CreateSheetDTO } from "../components/schemas/create_sheet_dto.js"


export interface ResponseMap {
  "201": Sheet
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters =(CreateSheetDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
