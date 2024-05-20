import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "200": unknown
}


interface QueryArg {
}

interface ParamArg {
    "code": string
}

interface HeaderArg {
}


export function deleteForbiddenApplicationCode<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.delete<ResponseMap[STATUS]>("/api/forbidden-application-code/:code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code/:code",
    })

  if (arg && "code" in arg) req.params("code", String(arg["code"]))

  return req
}
