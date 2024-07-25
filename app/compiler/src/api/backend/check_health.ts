import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/check_health"



export function checkHealth<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/health")
    .option('module', {
      name: "backend",
      pathname: "/api/health",
    })


  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
