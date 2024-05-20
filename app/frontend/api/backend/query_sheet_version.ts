import { Keq } from 'keq'
import { request } from 'keq'
import { SheetVersion } from "./components/schemas/sheet_version"


interface ResponseMap {
  "200": SheetVersion
}


interface QueryArg {
}

interface ParamArg {
    "sheetVersionId": string
}

interface HeaderArg {
}


export function querySheetVersion<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet-version/:sheetVersionId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet-version/:sheetVersionId",
    })

  if (arg && "sheetVersionId" in arg) req.params("sheetVersionId", String(arg["sheetVersionId"]))

  return req
}
