import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_sdks.js"



export function querySdks<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sdk")
    .option('module', {
      name: "backend",
      pathname: "/api/sdk",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "sheetId" in arg) req.query("sheetId", queryWrap(arg["sheetId"]))
  if (arg && "version" in arg) req.query("version", queryWrap(arg["version"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
