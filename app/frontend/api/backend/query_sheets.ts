import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_sheets.js"



export function querySheets<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "title" in arg) req.query("title", queryWrap(arg["title"]))
  if (arg && "type" in arg) req.query("type", queryWrap(arg["type"]))
  if (arg && "applicationId" in arg) req.query("applicationId", queryWrap(arg["applicationId"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
