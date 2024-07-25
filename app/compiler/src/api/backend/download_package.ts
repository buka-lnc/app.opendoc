import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/download_package"



/**
 * 下载包
 */
export function downloadPackage<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/registry/:packageScope/:packageName/-/:packageTag.tgz")
    .option('module', {
      name: "backend",
      pathname: "/api/registry/:packageScope/:packageName/-/:packageTag.tgz",
    })

  if (arg && "packageName" in arg) req.params("packageName", String(arg["packageName"]))
  if (arg && "packageTag" in arg) req.params("packageTag", String(arg["packageTag"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
