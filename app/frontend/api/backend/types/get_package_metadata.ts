import type { KeqOperation } from 'keq'
import type { PackageMetadataDTO } from "../components/schemas/package_metadata_dto"


export interface ResponseMap {
  "200": PackageMetadataDTO
}


export type QueryParameters = {
}

export type RouteParameters = {
  "packageName": string
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
