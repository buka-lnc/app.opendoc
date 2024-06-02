import type { KeqOperation } from 'keq'


export interface ResponseMap {
  "200": {
  "status"?: string
  "info"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "error"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "details"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  }
}
  "503": {
  "status"?: string
  "info"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "error"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "details"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  }
}
}


export type QueryParameters = {
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
