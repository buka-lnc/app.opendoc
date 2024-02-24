import { Keq } from 'keq'
import { request } from 'keq'

interface QueryArg {
}

interface ParamArg {
    apiDocumentId: string
}

interface HeaderArg {
}


export function queryApiDocumentFile(arg?: QueryArg & ParamArg & HeaderArg): Keq<any> {
  const req = request.get("/api/api-document/:apiDocumentId/file")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId/file",
    })

  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
