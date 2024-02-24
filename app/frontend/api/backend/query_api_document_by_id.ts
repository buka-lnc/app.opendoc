import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"

type Response_200_application_json = ApiDocument

interface QueryArg {
}

interface ParamArg {
    apiDocumentId: string
}

interface HeaderArg {
}


export function queryApiDocumentById(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/api-document/:apiDocumentId")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId",
    })

  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
