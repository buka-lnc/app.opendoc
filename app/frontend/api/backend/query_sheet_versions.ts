import { Keq } from 'keq'
import { request } from 'keq'
import { QuerySheetVersionsResponseDTO } from "./components/schemas/query_sheet_versions_response_dto"


interface ResponseMap {
  "200": QuerySheetVersionsResponseDTO
}


interface QueryArg {
    "sheetId": string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function querySheetVersions<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet-version")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet-version",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "sheetId" in arg) req.query("sheetId", queryWrap(arg["sheetId"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
