import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  200: unknown
  500: unknown
}


interface QueryArg {
}

interface ParamArg {
    applicationIdOrCode: string
}

interface HeaderArg {
}


export function deleteApplication<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.delete<ResponseMap[STATUS]>
  ("/api/application/:applicationIdOrCode")
    .option('module', {
      name: "backend",
      pathname: "/api/application/:applicationIdOrCode",
    })

  if (arg && "applicationIdOrCode" in arg) req.params("applicationIdOrCode", String(arg["applicationIdOrCode"]))

  return req
}
