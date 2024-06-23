import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_sheet_version"



export function querySheetVersion<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet-version/:sheetVersionId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet-version/:sheetVersionId",
    })

  if (arg && "sheetVersionId" in arg) req.params("sheetVersionId", String(arg["sheetVersionId"]))

  return req
}
