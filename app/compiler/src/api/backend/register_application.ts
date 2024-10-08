import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/register_application"



export function registerApplication<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/application/register")
    .option('module', {
      name: "backend",
      pathname: "/api/application/register",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req as unknown as Keq<ResponseMap[STATUS], Operation<STATUS>>
}
