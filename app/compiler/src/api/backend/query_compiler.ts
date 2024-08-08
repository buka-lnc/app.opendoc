import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_compiler"



export function queryCompiler<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/plugin/:compilerId")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin/:compilerId",
    })

  if (arg && "compilerId" in arg) req.params("compilerId", String(arg["compilerId"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
