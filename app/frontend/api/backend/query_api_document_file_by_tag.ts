import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocumentFile } from "./components/schemas/api_document_file"


interface ResponseMap {
  "200": ApiDocumentFile
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "tagName": string
    "apiDocumentId": string
}

interface HeaderArg {
}


export function queryApiDocumentFileByTag<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document/:apiDocumentId/tag/:tagName/api-document-file")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId/tag/:tagName/api-document-file",
    })

  if (arg && "tagName" in arg) req.params("tagName", String(arg["tagName"]))
  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
