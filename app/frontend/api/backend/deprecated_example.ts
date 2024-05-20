import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "201": unknown
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
 * This is a deprecated example
 *
 * @deprecated
 */
export function deprecatedExample<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>("/api/deprecated-example/:id")
    .option('module', {
      name: "backend",
      pathname: "/api/deprecated-example/:id",
    })

  if (arg && "id" in arg) req.params("id", String(arg["id"]))

  return req
}
