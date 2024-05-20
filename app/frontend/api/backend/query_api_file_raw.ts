import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "200": string
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "apiFileId": string
}

interface HeaderArg {
}


export function queryApiFileRaw<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/api-file/:apiFileId/raw")
    .option('module', {
      name: "backend",
      pathname: "/api/api-file/:apiFileId/raw",
    })

  if (arg && "apiFileId" in arg) req.params("apiFileId", String(arg["apiFileId"]))

  return req
}
