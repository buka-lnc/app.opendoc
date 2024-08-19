import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_plugin_logs"



export function queryPluginLogs<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/plugin/:pluginId/logs/:date")
    .option('module', {
      name: "backend",
      pathname: "/api/plugin/:pluginId/logs/:date",
    })

  if (arg && "pluginId" in arg) req.params("pluginId", String(arg["pluginId"]))
  if (arg && "date" in arg) req.params("date", String(arg["date"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
