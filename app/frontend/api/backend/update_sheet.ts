import { Keq } from 'keq'
import { request } from 'keq'
import type { RequestParameters, ResponseMap, Operation } from "./types/update_sheet.js"



export function updateSheet<STATUS extends keyof ResponseMap>(arg?: RequestParameters): Keq<ResponseMap[STATUS], Operation<STATUS>> {
  const req = request.put<ResponseMap[STATUS]>("/api/sheet/:sheetId")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/:sheetId",
    })

  if (arg && "sheetId" in arg) req.params("sheetId", String(arg["sheetId"]))
  if (arg && "order" in arg) req.send({ "order": arg["order"] })
  if (arg && "type" in arg) req.send({ "type": arg["type"] })
  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "mode" in arg) req.send({ "mode": arg["mode"] })
  if (arg && "pullCrontab" in arg) req.send({ "pullCrontab": arg["pullCrontab"] })

  return req
}
