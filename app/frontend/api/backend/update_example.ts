import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/update_example"



/**
 * 删除 Example
 */
export function updateExample<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/example/:id",
    })

  if (arg && "Authorization" in arg) req.set("Authorization", arg["Authorization"])
  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
