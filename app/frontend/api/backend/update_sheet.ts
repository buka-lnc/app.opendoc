import { Keq } from 'keq'
import { request } from 'keq'
import { Sheet } from "./components/schemas/sheet"
import { UpdateSheetDTO } from "./components/schemas/update_sheet_dto"


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


export function updateSheet<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (UpdateSheetDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.put<ResponseMap[STATUS]>("/api/sheet/:sheetId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))
  if (arg && "pullCrontab" in arg) req.send({ "pullCrontab": arg["pullCrontab"] })
  if (arg && "order" in arg) req.send({ "order": arg["order"] })
  if (arg && "type" in arg) req.send({ "type": arg["type"] })
  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "mode" in arg) req.send({ "mode": arg["mode"] })

  return req
}
