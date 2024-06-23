import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/query_examples"



/**
 * 查询 Example 列表
 */
export function queryExamples<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.get<ResponseMap[STATUS]>("/api/example")
    .option('module', {
      name: "backend",
      pathname: "/api/example",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "name" in arg) req.query("name", queryWrap(arg["name"]))

  return req
}
