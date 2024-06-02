import type { KeqOperation } from 'keq'
import type { ExampleDTO } from "../components/schemas/example_dto.js"


export interface ResponseMap {
  "201": unknown
  "400": {
  "statusCode": number
  "message": string
  "error"?: string
}
  "500": unknown
}


export type QueryParameters = {
}

export type RouteParameters = {
}

export type HeaderParameters = {
    "Authorization": string
}

export type BodyParameters =(ExampleDTO)

export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}
