import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/update_compiler"



export function updateCompiler<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/compiler/:compilerId")
    .option('module', {
      name: "backend",
      pathname: "/api/compiler/:compilerId",
    })

  if (arg && "compilerId" in arg) req.params("compilerId", String(arg["compilerId"]))
  if (arg && "url" in arg) req.send({ "url": arg["url"] })

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
