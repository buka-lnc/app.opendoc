import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterDocumentDTO } from "./components/schemas/register_document_dto"

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function registerDocument(arg?: QueryArg & ParamArg & HeaderArg & (RegisterDocumentDTO)): Keq<any> {
  const req = request.post("/api/document")
    .option('module', {
      name: "backend",
      pathname: "/api/document",
    })


  return req
}
