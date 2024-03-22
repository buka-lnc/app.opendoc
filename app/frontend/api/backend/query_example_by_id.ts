import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "200": unknown
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
}


/**
 * 查询 Example 详情
 */
export function queryExampleById<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/example/:id",
    })

  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
