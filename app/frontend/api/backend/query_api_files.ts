import { Keq } from 'keq'
import { request } from 'keq'
import { ResponseOfQueryApiFilesDTO } from "./components/schemas/response_of_query_api_files_dto"


interface ResponseMap {
  "200": ResponseOfQueryApiFilesDTO
  "500": unknown
}


interface QueryArg {
    "sheetId": string
    "version"?: string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApiFiles<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/api-file")
    .option('module', {
      name: "backend",
      pathname: "/api/api-file",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "sheetId" in arg) req.query("sheetId", queryWrap(arg["sheetId"]))
  if (arg && "version" in arg) req.query("version", queryWrap(arg["version"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
