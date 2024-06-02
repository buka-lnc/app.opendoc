import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_forbidden_application_codes.js"



export function queryForbiddenApplicationCodes<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/forbidden-application-code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code",
    })


  return req
}
