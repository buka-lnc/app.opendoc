import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/delete_application.js"



export function deleteApplication<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.delete<ResponseMap[STATUS]>("/api/application/:applicationIdOrCode")
    .option('module', {
      name: "backend",
      pathname: "/api/application/:applicationIdOrCode",
    })

  if (arg && "applicationIdOrCode" in arg) req.params("applicationIdOrCode", String(arg["applicationIdOrCode"]))

  return req
}
