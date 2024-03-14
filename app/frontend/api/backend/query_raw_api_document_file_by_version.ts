import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  200: unknown
  500: unknown
}


interface QueryArg {
}

interface ParamArg {
    version: string
    apiDocumentId: string
}

interface HeaderArg {
}


export function queryRawApiDocumentFileByVersion<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document/:apiDocumentId/version/:version/api-document-file/raw")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId/version/:version/api-document-file/raw",
    })

  if (arg && "version" in arg) req.params("version", String(arg["version"]))
  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
