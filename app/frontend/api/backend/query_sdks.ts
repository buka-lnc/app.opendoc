import { Keq } from 'keq'
import { request } from 'keq'
import { ResponseOfQuerySdksDTO } from "./components/schemas/response_of_query_sdks_dto"


interface ResponseMap {
  "200": ResponseOfQuerySdksDTO
  "500": unknown
}


interface QueryArg {
    "sheetId"?: string
    "version"?: string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function querySdks<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sdk")
    .option('module', {
      name: "backend",
      pathname: "/api/sdk",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "sheetId" in arg) req.query("sheetId", queryWrap(arg["sheetId"]))
  if (arg && "version" in arg) req.query("version", queryWrap(arg["version"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
