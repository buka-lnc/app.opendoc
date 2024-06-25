import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/sync_api_document"



export function syncApiDocument<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/sheet/:sheetId/sync")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId/sync",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))

  return req
}
