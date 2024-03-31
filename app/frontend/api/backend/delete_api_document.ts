import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "200": unknown
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "apiDocumentId": string
}

interface HeaderArg {
}


export function deleteApiDocument<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.delete<ResponseMap[STATUS]>
  ("/api/api-document/:apiDocumentId")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId",
    })

  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
