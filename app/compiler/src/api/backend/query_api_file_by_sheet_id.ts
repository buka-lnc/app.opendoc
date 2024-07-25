import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_api_file_by_sheet_id"



export function queryApiFileBySheetId<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet/:sheetId/version/:version/path/:path")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId/version/:version/path/:path",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))
  if (arg && "version" in arg) req.params("version", String(arg["version"]))
  if (arg && "path" in arg) req.params("path", String(arg["path"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
