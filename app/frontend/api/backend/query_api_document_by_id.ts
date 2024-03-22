import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"


interface ResponseMap {
  "200": ApiDocument
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "apiDocumentId": string
}

interface HeaderArg {
}


export function queryApiDocumentById<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document/:apiDocumentId")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId",
    })

  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
