import { Keq } from 'keq'
import { request } from 'keq'
import { ResponseOfQueryApplicationsDTO } from "./components/schemas/response_of_query_applications_dto"


interface ResponseMap {
  "200": ResponseOfQueryApplicationsDTO
  "500": unknown
}


interface QueryArg {
    "title"?: string
    "code"?: string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApplications<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "title" in arg) req.query("title", queryWrap(arg["title"]))
  if (arg && "code" in arg) req.query("code", queryWrap(arg["code"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
