import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/update_plugin"



export function updatePlugin<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/plugin/:pluginId")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin/:pluginId",
    })

  if (arg && "pluginId" in arg) req.params("pluginId", String(arg["pluginId"]))
  if (arg && "status" in arg) req.send({ "status": arg["status"] })
  if (arg && "options" in arg) req.send({ "options": arg["options"] })

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
