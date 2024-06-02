import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/create_example.js"



/**
 * 创建 Example
 */
export function createExample<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/example")
    .option('module', {
      name: "backend",
      pathname: "/api/example",
    })

  if (arg && "Authorization" in arg) req.set("Authorization", arg["Authorization"])
  if (arg && "id" in arg) req.send({ "id": arg["id"] })
  if (arg && "name" in arg) req.send({ "name": arg["name"] })

  return req
}
