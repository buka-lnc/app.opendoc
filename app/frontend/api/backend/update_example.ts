import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "201": unknown
  "400": {
  "statusCode": number
  "message": string
  "error"?: string
}
  "404": {
  "statusCode": number
  "message": string
  "error"?: string
}
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "id": string
}

interface HeaderArg {
    "Authorization": string
}


/**
 * 删除 Example
 */
export function updateExample<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>("/api/example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/example/:id",
    })

  if (arg && "Authorization" in arg) req.set("Authorization", arg["Authorization"])
  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
