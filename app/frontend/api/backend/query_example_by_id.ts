import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_example_by_id.js"



/**
 * 查询 Example 详情
 */
export function queryExampleById<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/example/:id",
    })

  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
