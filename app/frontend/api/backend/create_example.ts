import { Keq } from 'keq'
import { request } from 'keq'
import { ExampleDTO } from "./components/schemas/example_dto"


interface ResponseMap {
  "201": unknown
  "400": {
  "statusCode": number
  "message": string
  "error"?: string
}
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
    "Authorization": string
}


/**
 * 创建 Example
 */
export function createExample<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (ExampleDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>
  ("/api/example")
    .option('module', {
      name: "backend",
      pathname: "/api/example",
    })

  if (arg && "Authorization" in arg) req.set("Authorization", arg["Authorization"])
  if (arg && "id" in arg) req.send({ "id": arg["id"] })
  if (arg && "name" in arg) req.send({ "name": arg["name"] })

  return req
}
