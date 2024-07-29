import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/delete_compiler"



export function deleteCompiler<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.delete<ResponseMap[STATUS]>("/api/compiler/:compilerId")
    .option('module', {
      name: "backend",
      pathname: "/api/compiler/:compilerId",
    })

  if (arg && "compilerId" in arg) req.params("compilerId", String(arg["compilerId"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
