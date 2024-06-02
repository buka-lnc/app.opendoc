import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_sheet_by_id.js"



export function querySheetById<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet/:sheetId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))

  return req
}
