import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/delete_forbidden_application_code"



export function deleteForbiddenApplicationCode<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.delete<ResponseMap[STATUS]>("/api/forbidden-application-code/:code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code/:code",
    })

  if (arg && "code" in arg) req.params("code", String(arg["code"]))

  return req
}
