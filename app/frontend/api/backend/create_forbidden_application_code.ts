import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/create_forbidden_application_code.js"



export function createForbiddenApplicationCode<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/forbidden-application-code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code",
    })

  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
