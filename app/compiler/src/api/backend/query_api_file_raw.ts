import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_api_file_raw"



export function queryApiFileRaw<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/api-file/:apiFileId/raw")
    .option('module', {
      name: "backend",
      pathname: "/api/api-file/:apiFileId/raw",
    })

  if (arg && "apiFileId" in arg) req.params("apiFileId", String(arg["apiFileId"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
