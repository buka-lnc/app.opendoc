import { Keq } from 'keq'
import { request } from 'keq'
import { Sheet } from "./components/schemas/sheet"
import { CreateSheetDTO } from "./components/schemas/create_sheet_dto"


interface ResponseMap {
  "201": Sheet
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function createSheet<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (CreateSheetDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>("/api/sheet")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet",
    })

  if (arg && "application" in arg) req.send({ "application": arg["application"] })
  if (arg && "pullCrontab" in arg) req.send({ "pullCrontab": arg["pullCrontab"] })
  if (arg && "order" in arg) req.send({ "order": arg["order"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })
  if (arg && "type" in arg) req.send({ "type": arg["type"] })
  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "mode" in arg) req.send({ "mode": arg["mode"] })

  return req
}
