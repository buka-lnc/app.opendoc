import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/create_plugin"



export function createPlugin<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/plugin")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin",
    })

  if (arg && "url" in arg) req.send({ "url": arg["url"] })

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
