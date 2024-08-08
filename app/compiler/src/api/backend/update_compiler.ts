import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/update_compiler"



export function updateCompiler<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/plugin/:compilerId")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin/:compilerId",
    })

  if (arg && "compilerId" in arg) req.params("compilerId", String(arg["compilerId"]))
  if (arg && "status" in arg) req.send({ "status": arg["status"] })
  if (arg && "options" in arg) req.send({ "options": arg["options"] })

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
