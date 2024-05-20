import { Keq } from 'keq'
import { request } from 'keq'
import { ApiFile } from "./components/schemas/api_file"


interface ResponseMap {
  "200": ApiFile
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "apiFileId": string
}

interface HeaderArg {
}


export function queryApiFile<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/api-file/:apiFileId")
    .option('module', {
      name: "backend",
      pathname: "/api/api-file/:apiFileId",
    })

  if (arg && "apiFileId" in arg) req.params("apiFileId", String(arg["apiFileId"]))

  return req
}
