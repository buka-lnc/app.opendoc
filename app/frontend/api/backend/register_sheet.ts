import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterSheetDTO } from "./components/schemas/register_sheet_dto"


interface ResponseMap {
  "200": unknown
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


/**
 * 若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。
 */
export function registerSheet<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (RegisterSheetDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.put<ResponseMap[STATUS]>("/api/sheet/register")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/register",
    })


  return req
}
