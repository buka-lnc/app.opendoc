import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/delete_plugin"



export function deletePlugin<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.delete<ResponseMap[STATUS]>("/api/plugin/:pluginId")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin/:pluginId",
    })

  if (arg && "pluginId" in arg) req.params("pluginId", String(arg["pluginId"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
