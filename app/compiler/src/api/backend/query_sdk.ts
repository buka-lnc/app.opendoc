import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_sdk"



export function querySdk<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/sdk/:sdkId")
    .option('module', {
      name: "backend",
      pathname: "/api/sdk/:sdkId",
    })

  if (arg && "sdkId" in arg) req.params("sdkId", String(arg["sdkId"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
