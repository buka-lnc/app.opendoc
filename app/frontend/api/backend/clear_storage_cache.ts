import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/clear_storage_cache"



export function clearStorageCache<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.delete<ResponseMap[STATUS]>("/api/storage/cache")
    .option('module', {
      name: "backend",
      pathname: "/api/storage/cache",
    })


  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
