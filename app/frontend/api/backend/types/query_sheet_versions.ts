import type { KeqOperation } from 'keq'
import type { QuerySheetVersionsResponseDTO } from "../components/schemas/query_sheet_versions_response_dto"


export interface ResponseMap {
  "200": QuerySheetVersionsResponseDTO
}


export type QueryParameters = {
  "sheetId": string
  "limit"?: string
  "offset"?: string
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
