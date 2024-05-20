import { Keq } from 'keq'
import { request } from 'keq'
import { ResponseOfQuerySheetsDTO } from "./components/schemas/response_of_query_sheets_dto"


interface ResponseMap {
  "200": ResponseOfQuerySheetsDTO
  "500": unknown
}


interface QueryArg {
    "title"?: string
    "type"?: string
    "applicationId"?: string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function querySheets<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "title" in arg) req.query("title", queryWrap(arg["title"]))
  if (arg && "type" in arg) req.query("type", queryWrap(arg["type"]))
  if (arg && "applicationId" in arg) req.query("applicationId", queryWrap(arg["applicationId"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
