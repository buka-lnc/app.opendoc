import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"

type Response_200_application_json = ApiDocument

interface QueryArg {
}

interface ParamArg {
    documentId: string
}

interface HeaderArg {
}


export function queryApiDocumentById(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/document/:documentId")
    .option('module', {
      name: "backend",
      pathname: "/api/document/:documentId",
    })

  if (arg && "documentId" in arg) req.params("documentId", String(arg["documentId"]))

  return req
}
