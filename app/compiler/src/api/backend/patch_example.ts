import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/patch_example"



/**
 * 更新 Example
 */
export function patchExample<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.patch<ResponseMap[STATUS]>("/api/example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/example/:id",
    })

  if (arg && "Authorization" in arg) req.set("Authorization", arg["Authorization"])
  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
