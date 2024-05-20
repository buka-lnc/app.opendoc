import { Keq } from 'keq'
import { request } from 'keq'
import { Sheet } from "./components/schemas/sheet"


interface ResponseMap {
  "200": Sheet
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "sheetId": string
}

interface HeaderArg {
}


export function querySheetById<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/sheet/:sheetId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))

  return req
}
