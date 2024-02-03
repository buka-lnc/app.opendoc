import { Keq } from 'keq'
import { request } from 'keq'

interface QueryArg {
}

interface ParamArg {
    documentId: string
}

interface HeaderArg {
}


export function queryApiDocumentFile(arg?: QueryArg & ParamArg & HeaderArg): Keq<any> {
  const req = request.get("/api/document/:documentId/file")
    .option('module', {
      name: "backend",
      pathname: "/api/document/:documentId/file",
    })

  if (arg && "documentId" in arg) req.params("documentId", String(arg["documentId"]))

  return req
}
