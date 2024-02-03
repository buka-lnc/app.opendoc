import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"

type Response_200_application_json = ApiDocument

interface QueryArg {
}

interface ParamArg {
    folderId: string
    documentCode: string
}

interface HeaderArg {
}


export function queryApiDocumentByCode(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/folder/:folderId/document/:documentCode")
    .option('module', {
      name: "backend",
      pathname: "/api/folder/:folderId/document/:documentCode",
    })

  if (arg && "folderId" in arg) req.params("folderId", String(arg["folderId"]))
  if (arg && "documentCode" in arg) req.params("documentCode", String(arg["documentCode"]))

  return req
}
