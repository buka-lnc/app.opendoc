import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterApiDocumentDTO } from "./components/schemas/register_api_document_dto"

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function registerApiDocument(arg?: QueryArg & ParamArg & HeaderArg & (RegisterApiDocumentDTO)): Keq<any> {
  const req = request.post("/api/document")
    .option('module', {
      name: "backend",
      pathname: "/api/document",
    })


  return req
}
