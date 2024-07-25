import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/get_package_metadata"



/**
 * 查询包的元数据
 */
export function getPackageMetadata<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/registry/:packageScope/:packageName")
    .option('module', {
      name: "backend",
      pathname: "/api/registry/:packageScope/:packageName",
    })

  if (arg && "packageName" in arg) req.params("packageName", String(arg["packageName"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
