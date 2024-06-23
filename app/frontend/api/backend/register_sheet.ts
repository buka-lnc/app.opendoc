import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/register_sheet"



/**
 * 若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。
 */
export function registerSheet<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/sheet/register")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/register",
    })


  return req
}
