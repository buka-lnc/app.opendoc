import { Keq } from 'keq'
import { request } from 'keq'
import { Application } from "./components/schemas/application"


interface ResponseMap {
  "200": Application
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "applicationIdOrCode": string
}

interface HeaderArg {
}


export function queryApplication<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/application/:applicationIdOrCode")
    .option('module', {
      name: "backend",
      pathname: "/api/application/:applicationIdOrCode",
    })

  if (arg && "applicationIdOrCode" in arg) req.params("applicationIdOrCode", String(arg["applicationIdOrCode"]))

  return req
}
