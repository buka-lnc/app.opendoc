import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocumentFile } from "./components/schemas/api_document_file"

type Response_200_application_json = (ApiDocumentFile)[]

interface QueryArg {
}

interface ParamArg {
    apiDocumentId: string
}

interface HeaderArg {
}


export function queryApiDocumentFilesOfApiDocument(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json | any> {
  const req = request.get<Response_200_application_json | any>("/api/api-document/:apiDocumentId/api-document-file")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId/api-document-file",
    })

  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
