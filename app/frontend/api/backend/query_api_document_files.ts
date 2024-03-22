import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocumentFile } from "./components/schemas/api_document_file"


interface ResponseMap {
  "200": (ApiDocumentFile)[]
}


interface QueryArg {
    "tags"?: (string)[]
    "apiDocumentIds": (string)[]
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApiDocumentFiles<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document-file")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document-file",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "tags" in arg) req.query("tags", queryWrap(arg["tags"]))
  if (arg && "apiDocumentIds" in arg) req.query("apiDocumentIds", queryWrap(arg["apiDocumentIds"]))

  return req
}
