import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/register_application.js"



export function registerApplication<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
