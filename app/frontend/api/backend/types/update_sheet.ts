import type { KeqOperation } from 'keq'
import type { Sheet } from "../components/schemas/sheet"
import type { UpdateSheetDTO } from "../components/schemas/update_sheet_dto"


export interface ResponseMap {
  "200": Sheet
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
    "sheetId": string
}

export type HeaderParameters = {
}

export type BodyParameters =(UpdateSheetDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
