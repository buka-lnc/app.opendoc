import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/sync_api_documents"



/**
 * 每隔 10 分钟自动同步一次
 */
export function syncApiDocuments<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/sheet/sync")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/sync",
    })


  return req
}
