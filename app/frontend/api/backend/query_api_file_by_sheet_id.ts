import { Keq } from 'keq'
import { request } from 'keq'
import { ApiFile } from "./components/schemas/api_file"


interface ResponseMap {
  "200": ApiFile
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "sheetId": string
    "version": string
    "path": string
}

interface HeaderArg {
}


export function queryApiFileBySheetId<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet/:sheetId/version/:version/path/:path")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId/version/:version/path/:path",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))
  if (arg && "version" in arg) req.params("version", String(arg["version"]))
  if (arg && "path" in arg) req.params("path", String(arg["path"]))

  return req
}
