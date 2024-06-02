import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/deprecated_example.js"



/**
 * This is a deprecated example
 *
 * @deprecated
 */
export function deprecatedExample<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.post<ResponseMap[STATUS]>("/api/deprecated-example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/deprecated-example/:id",
    })

  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
